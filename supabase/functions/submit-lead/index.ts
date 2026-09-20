import { adminClient } from '../_shared/admin.ts';
import { handleOptions, respond } from '../_shared/http.ts';

const workspaceId = '00000000-0000-0000-0000-000000000001';
const services = new Set(['web_design','ai_agent','other']);
const budgets = new Set(['','under_50','50_100','100_250','over_250']);

type LeadPayload = {
  workspace_id: string; name: string; phone: string; email: string | null;
  business_name: string | null; service_type: string; budget_range: string | null;
  brief: string; consent: true; source: 'website_request';
};

export type SubmitLeadDependencies = {
  env(name: string): string | undefined;
  verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean>;
  fingerprint(salt: string, ip: string): Promise<string>;
  consumeLimit(fingerprint: string): Promise<boolean>;
  insertLead(payload: LeadPayload): Promise<void>;
};

const productionDependencies: SubmitLeadDependencies = {
  env: name => Deno.env.get(name),
  async verifyTurnstile(secret, token, ip) {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const verdict = await response.json() as { success?: boolean };
    return verdict.success === true;
  },
  async fingerprint(salt, ip) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}`));
    return [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2,'0')).join('');
  },
  async consumeLimit(fingerprint) {
    const { data, error } = await adminClient().rpc('consume_submission_rate_limit', { p_fingerprint_hash: fingerprint, p_limit: 5 });
    if (error) throw error;
    return data === true;
  },
  async insertLead(payload) {
    const { error } = await adminClient().from('lead_submissions').insert(payload);
    if (error) throw error;
  },
};

export async function submitLead(request: Request, deps: SubmitLeadDependencies = productionDependencies) {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'POST') return respond(request, { message: 'Method not allowed' }, 405);
  try {
    const contentType = request.headers.get('content-type') || '';
    const raw = contentType.includes('application/json') ? await request.json() : Object.fromEntries((await request.formData()).entries());
    const value = raw as Record<string, unknown>;
    if (String(value.website || '')) return respond(request, { ok: true });
    const name = String(value.name || '').trim();
    const phone = String(value.phone || '').replace(/[\s()-]/g, '').trim();
    const email = String(value.email || '').trim().toLowerCase() || null;
    const businessName = String(value.business_name || '').trim() || null;
    const serviceType = String(value.service_type || '');
    const budgetRange = String(value.budget_range || '');
    const brief = String(value.brief || '').trim();
    const consent = String(value.consent || '') === 'true';
    const turnstileToken = String(value['cf-turnstile-response'] || '');
    if (name.length < 2 || name.length > 100 || phone.length < 8 || phone.length > 20 || !services.has(serviceType) || !budgets.has(budgetRange) || brief.length < 10 || brief.length > 2000 || !consent) return respond(request, { message: 'اطلاعات فرم کامل یا معتبر نیست.' }, 422);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond(request, { message: 'ایمیل معتبر نیست.' }, 422);
    const secret = deps.env('TURNSTILE_SECRET_KEY');
    if (!secret || !turnstileToken) return respond(request, { message: 'اعتبارسنجی امنیتی کامل نشد.' }, 400);
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!await deps.verifyTurnstile(secret, turnstileToken, ip)) return respond(request, { message: 'اعتبارسنجی امنیتی ناموفق بود. صفحه را تازه کن.' }, 400);
    const salt = deps.env('RATE_LIMIT_SALT');
    if (!salt) throw new Error('missing_rate_limit_salt');
    const fingerprint = await deps.fingerprint(salt, ip);
    if (!await deps.consumeLimit(fingerprint)) return respond(request, { message: 'تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کن.' }, 429);
    await deps.insertLead({ workspace_id: workspaceId, name, phone, email, business_name: businessName, service_type: serviceType, budget_range: budgetRange || null, brief, consent: true, source: 'website_request' });
    return respond(request, { ok: true }, 201);
  } catch (error) {
    console.error('submit-lead failed', error instanceof Error ? error.message : 'unknown');
    return respond(request, { message: 'ثبت درخواست موقتاً ممکن نیست. لطفاً از واتساپ استفاده کن.' }, 500);
  }
}

if (import.meta.main) Deno.serve(request => submitLead(request));
