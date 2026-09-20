import { handleOptions, respond } from '../_shared/http.ts';
import { requireAdmin } from '../_shared/admin.ts';

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'POST') return respond(request, { message: 'Method not allowed' }, 405);
  try {
    const body = await request.json() as Record<string, string>;
    const { admin, user } = await requireAdmin(request, body.workspace_id);
    if (!body.user_id || !body.transfer_to || body.user_id === user.id) return respond(request, { message: 'عضو یا مقصد انتقال معتبر نیست.' }, 422);
    const { error } = await admin.rpc('admin_deactivate_member', { p_workspace_id: body.workspace_id, p_user_id: body.user_id, p_transfer_to: body.transfer_to });
    if (error) throw error;
    return respond(request, { ok: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown';
    return respond(request, { message: code === 'forbidden' ? 'دسترسی مدیر لازم است.' : 'غیرفعال‌سازی انجام نشد.' }, code === 'unauthorized' ? 401 : code === 'forbidden' ? 403 : 500);
  }
});
