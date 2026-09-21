import { handleOptions, respond } from '../_shared/http.ts';
import { requireAdmin } from '../_shared/admin.ts';
import { articleErrorStatus, validUuid } from '../_shared/articles.ts';
import { requestArticleDeploy } from '../_shared/article-deploy.ts';

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'POST') return respond(request, { message: 'Method not allowed' }, 405);
  try {
    const body = await request.json() as Record<string, unknown>;
    const workspaceId = validUuid(body.workspace_id, 'workspace_id');
    const articleId = validUuid(body.id, 'article_id');
    const { admin, user } = await requireAdmin(request, workspaceId);
    const result = await admin.from('articles').update({ status: 'archived', archived_at: new Date().toISOString(), deployment_status: 'pending' }).eq('workspace_id', workspaceId).eq('id', articleId).select('id,workspace_id').maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) throw new Error('article_not_found');
    const deployment = await requestArticleDeploy(admin, result.data, user.id, 'archive');
    return respond(request, { ok: true, ...deployment });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown';
    return respond(request, { message: code }, articleErrorStatus(code));
  }
});
