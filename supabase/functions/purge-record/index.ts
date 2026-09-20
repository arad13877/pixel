import { handleOptions, respond } from '../_shared/http.ts';
import { requireAdmin } from '../_shared/admin.ts';

const allowedTables = new Set(['contacts','companies','opportunities','lead_submissions','activities']);
Deno.serve(async request => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'POST') return respond(request, { message: 'Method not allowed' }, 405);
  try {
    const body = await request.json() as Record<string, string>;
    if (!allowedTables.has(body.table) || !body.id) return respond(request, { message: 'رکورد معتبر نیست.' }, 422);
    const { admin } = await requireAdmin(request, body.workspace_id);
    const { data: archived, error: readError } = await admin.from(body.table).select('id,archived_at').eq('workspace_id', body.workspace_id).eq('id', body.id).maybeSingle();
    if (readError || !archived?.archived_at) return respond(request, { message: 'فقط رکورد آرشیوشده قابل حذف دائمی است.' }, 409);
    const { error } = await admin.from(body.table).delete().eq('workspace_id', body.workspace_id).eq('id', body.id);
    if (error) throw error;
    return respond(request, { ok: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown';
    return respond(request, { message: code === 'forbidden' ? 'دسترسی مدیر لازم است.' : 'حذف دائمی انجام نشد.' }, code === 'unauthorized' ? 401 : code === 'forbidden' ? 403 : 500);
  }
});
