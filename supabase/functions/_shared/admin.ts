import { createClient } from 'npm:@supabase/supabase-js@2.116.0';

export function adminClient() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('missing_supabase_secrets');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function requireAdmin(request: Request, workspaceId: string) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('unauthorized');
  const admin = adminClient();
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) throw new Error('unauthorized');
  const { data: membership } = await admin.from('workspace_members').select('role,is_active').eq('workspace_id', workspaceId).eq('user_id', userData.user.id).maybeSingle();
  if (!membership?.is_active || membership.role !== 'admin') throw new Error('forbidden');
  return { admin, user: userData.user };
}
