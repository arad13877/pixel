import { handleOptions, isAllowedRedirect, respond } from '../_shared/http.ts';
import { requireAdmin } from '../_shared/admin.ts';

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'POST') return respond(request, { message: 'Method not allowed' }, 405);
  try {
    const body = await request.json() as Record<string, string>;
    const workspaceId = body.workspace_id;
    const email = body.email?.trim().toLowerCase();
    const fullName = body.full_name?.trim();
    const role = body.role === 'admin' ? 'admin' : 'member';
    if (!workspaceId || !email || !fullName || !body.redirect_to || !isAllowedRedirect(body.redirect_to)) return respond(request, { message: 'اطلاعات دعوت یا مسیر بازگشت معتبر نیست.' }, 422);
    const { admin } = await requireAdmin(request, workspaceId);
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: body.redirect_to, data: { full_name: fullName } });
    if (error || !data.user) throw error || new Error('invite_failed');
    await admin.from('profiles').upsert({ id: data.user.id, full_name: fullName, email });
    const membership = await admin.from('workspace_members').upsert({ workspace_id: workspaceId, user_id: data.user.id, role, is_active: true, deactivated_at: null });
    if (membership.error) throw membership.error;
    return respond(request, { ok: true }, 201);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown';
    return respond(request, { message: code === 'unauthorized' ? 'ورود معتبر نیست.' : code === 'forbidden' ? 'دسترسی مدیر لازم است.' : 'دعوت ارسال نشد.' }, code === 'unauthorized' ? 401 : code === 'forbidden' ? 403 : 500);
  }
});
