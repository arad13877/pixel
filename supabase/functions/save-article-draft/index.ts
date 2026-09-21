import { handleOptions, respond } from '../_shared/http.ts';
import { requireMember } from '../_shared/admin.ts';
import { articleErrorStatus, validateArticlePayload, validSlug, validUuid } from '../_shared/articles.ts';

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'POST') return respond(request, { message: 'Method not allowed' }, 405);
  try {
    const body = await request.json() as Record<string, unknown>;
    const workspaceId = validUuid(body.workspace_id, 'workspace_id');
    const id = validUuid(body.id || crypto.randomUUID(), 'article_id');
    const { admin, user } = await requireMember(request, workspaceId);
    const payload = validateArticlePayload(body.payload, workspaceId, id);
    const slug = validSlug(payload.slug);
    const { data: existing, error: readError } = await admin.from('articles').select('id,slug,published_at,status').eq('workspace_id', workspaceId).eq('id', id).maybeSingle();
    if (readError) throw readError;
    if (existing?.published_at && existing.slug !== slug) throw new Error('slug_locked');
    const duplicate = await admin.from('articles').select('id').eq('workspace_id', workspaceId).eq('slug', slug).neq('id', id).maybeSingle();
    if (duplicate.data) throw new Error('slug_exists');
    const values = { id, workspace_id: workspaceId, slug, draft_payload: payload, updated_by: user.id, ...(existing ? {} : { created_by: user.id, status: 'draft' }) };
    const query = existing ? admin.from('articles').update(values).eq('id', id).eq('workspace_id', workspaceId) : admin.from('articles').insert(values);
    const { data, error } = await query.select('*').single();
    if (error) {
      if (error.code === '23505') throw new Error('slug_exists');
      throw error;
    }
    return respond(request, { article: data }, existing ? 200 : 201);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown';
    return respond(request, { message: code }, articleErrorStatus(code));
  }
});
