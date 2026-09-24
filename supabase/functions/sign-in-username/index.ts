import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
import { adminClient } from '../_shared/admin.ts';
import { handleOptions, isAllowedOrigin, respond } from '../_shared/http.ts';

const invalidCredentials = 'نام کاربری یا رمز عبور درست نیست.';
const usernamePattern = /^[a-z0-9_]{3,32}$/;

type SignInSession = { access_token: string; refresh_token: string };
export type Dependencies = {
  fingerprint(value: string): Promise<string>;
  consumeLimit(hash: string, limit: number): Promise<boolean>;
  findAccount(username: string): Promise<{ id: string; email: string } | null>;
  signIn(email: string, password: string): Promise<{ userId: string; session: SignInSession } | null>;
  isActiveMember(userId: string): Promise<boolean>;
};

const productionDependencies: Dependencies = {
  async fingerprint(value) {
    const salt = Deno.env.get('RATE_LIMIT_SALT');
    if (!salt) throw new Error('missing_rate_limit_salt');
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:crm-login:${value}`));
    return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  },
  async consumeLimit(hash, limit) {
    const { data, error } = await adminClient().rpc('consume_submission_rate_limit', {
      p_fingerprint_hash: hash, p_limit: limit, p_window: '15 minutes',
    });
    if (error) throw error;
    return data === true;
  },
  async findAccount(username) {
    const admin = adminClient();
    const { data: profile, error } = await admin.from('profiles').select('id').eq('username', username).maybeSingle();
    if (error) throw error;
    if (!profile) return null;
    const { data, error: userError } = await admin.auth.admin.getUserById(profile.id);
    if (userError) throw userError;
    return data.user?.email ? { id: profile.id, email: data.user.email } : null;
  },
  async signIn(email, password) {
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_ANON_KEY');
    if (!url || !key) throw new Error('missing_supabase_auth_config');
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user || !data.session) return null;
    return { userId: data.user.id, session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token } };
  },
  async isActiveMember(userId) {
    const { data, error } = await adminClient().from('workspace_members').select('user_id').eq('user_id', userId).eq('is_active', true).limit(1);
    if (error) throw error;
    return Boolean(data?.length);
  },
};

export async function signInWithUsername(request: Request, deps: Dependencies = productionDependencies) {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'POST') return respond(request, { message: 'Method not allowed' }, 405);
  const origin = request.headers.get('origin');
  if (origin && !isAllowedOrigin(origin)) return respond(request, { message: 'Origin not allowed' }, 403);
  try {
    const body = await request.json() as Record<string, unknown>;
    const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!usernamePattern.test(username) || !password || password.length > 1024) return respond(request, { message: invalidCredentials }, 401);

    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const [ipHash, userHash] = await Promise.all([
      deps.fingerprint(`ip:${ip}`), deps.fingerprint(`username:${username}`),
    ]);
    const [ipAllowed, userAllowed] = await Promise.all([
      deps.consumeLimit(ipHash, 50), deps.consumeLimit(userHash, 10),
    ]);
    if (!ipAllowed || !userAllowed) return respond(request, { message: 'تلاش‌های ورود زیاد بوده است. ۱۵ دقیقه دیگر دوباره امتحان کن.' }, 429);

    const account = await deps.findAccount(username);
    const candidateEmail = account?.email || 'missing-user@invalid.pxlgrid.design';
    const result = await deps.signIn(candidateEmail, password);
    if (!account || !result || result.userId !== account.id || !await deps.isActiveMember(account.id)) {
      return respond(request, { message: invalidCredentials }, 401);
    }
    const response = respond(request, { access_token: result.session.access_token, refresh_token: result.session.refresh_token });
    response.headers.set('cache-control', 'no-store');
    return response;
  } catch {
    return respond(request, { message: 'ورود موقتاً ممکن نیست. کمی بعد دوباره تلاش کن.' }, 503);
  }
}

if (import.meta.main) Deno.serve(request => signInWithUsername(request));
