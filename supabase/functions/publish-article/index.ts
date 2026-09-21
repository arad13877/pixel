import { handleOptions, respond } from '../_shared/http.ts';
import { requireAdmin } from '../_shared/admin.ts';
import { articleErrorStatus, validateArticlePayload, validUuid } from '../_shared/articles.ts';
import { requestArticleDeploy } from '../_shared/article-deploy.ts';

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'POST') return respond(request, { message: 'Method not allowed' }, 405);
  try {
    const body = await request.json() as Record<string, unknown>;
    const workspaceId = validUuid(body.workspace_id, 'workspace_id');
    const articleId = validUuid(body.id, 'article_id');
    const { admin, user } = await requireAdmin(request, workspaceId);
    const { data: article } = await admin.from('articles').select('*').eq('workspace_id', workspaceId).eq('id', articleId).maybeSingle();
    if (!article) throw new Error('article_not_found');
    const now = new Date().toISOString();
    const payload = validateArticlePayload({ ...article.draft_payload, publishedAt: article.published_at || now, modifiedAt: now }, workspaceId, articleId);
    const updated = await admin.from('articles').update({ status: 'published', draft_payload: payload, published_payload: payload, published_at: article.published_at || now, published_by: user.id, updated_by: user.id, archived_at: null, deployment_status: 'pending' }).eq('id', articleId).eq('workspace_id', workspaceId).select('id,workspace_id').single();
    if (updated.error) throw updated.error;
    const deployment = await requestArticleDeploy(admin, updated.data, user.id, 'publish');
    return respond(request, { ok: true, ...deployment });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown';
    return respond(request, { message: code }, articleErrorStatus(code));
  }
});
