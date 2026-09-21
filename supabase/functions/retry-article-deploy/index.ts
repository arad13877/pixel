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
    const { data: article } = await admin.from('articles').select('id,workspace_id,status,deployment_status').eq('workspace_id', workspaceId).eq('id', articleId).maybeSingle();
    if (!article) throw new Error('article_not_found');
    if (article.deployment_status !== 'failed') throw new Error('deploy_not_retryable');
    const deployment = await requestArticleDeploy(admin, article, user.id, 'retry');
    return respond(request, { ok: true, ...deployment });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown';
    return respond(request, { message: code }, articleErrorStatus(code));
  }
});
