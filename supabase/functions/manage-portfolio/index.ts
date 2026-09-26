import { handleOptions, respond } from '../_shared/http.ts';
import { requireAdmin, requireMember } from '../_shared/admin.ts';
import { imageDimensions, portfolioErrorStatus, validPortfolioId, validatePortfolioPayload } from '../_shared/portfolio.ts';
import { requestPortfolioDeploy } from '../_shared/portfolio-deploy.ts';

const types = new Set(['image/jpeg', 'image/png', 'image/webp']);

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'POST') return respond(request, { message: 'Method not allowed' }, 405);
  try {
    const body = await request.json() as Record<string, unknown>;
    const workspaceId = body.workspace_id;
    const action = body.action;
    if (!validPortfolioId(workspaceId)) throw new Error('invalid_workspace_id');
    if (!['save', 'publish', 'archive', 'reorder', 'retry'].includes(String(action))) throw new Error('invalid_action');
    const context = action === 'save' ? await requireMember(request, workspaceId as string) : await requireAdmin(request, workspaceId as string);
    const { admin, user } = context;
    const id = body.id || crypto.randomUUID();
    if (!validPortfolioId(id)) throw new Error('invalid_id');
    if (action === 'reorder') {
      if (!Array.isArray(body.ids) || body.ids.length > 1000 || !body.ids.every(validPortfolioId) || !body.ids.includes(id)) throw new Error('invalid_order');
      const result = await admin.rpc('reorder_portfolio_items', { p_workspace_id: workspaceId, p_ids: body.ids });
      if (result.error) throw new Error('invalid_order');
      await requestPortfolioDeploy(admin, id as string, workspaceId as string, 'reorder');
      return respond(request, { ok: true, deployment_status: 'requested' });
    }
    const { data: row, error: readError } = await admin.from('portfolio_items').select('*').eq('workspace_id', workspaceId).eq('id', id).maybeSingle();
    if (readError) throw readError;
    if (action !== 'save' && !row) throw new Error('portfolio_not_found');
    if (action === 'save') {
      const kind = row?.kind || 'client';
      const payload = validatePortfolioPayload(body.payload, kind, workspaceId as string, id as string);
      if (kind === 'client') {
        const downloaded = await admin.storage.from('portfolio-drafts').download(payload.imagePath);
        if (downloaded.error || !downloaded.data) throw new Error('invalid_image_path');
        const blob = downloaded.data;
        if (!types.has(blob.type) || blob.size > 5 * 1024 * 1024) throw new Error('invalid_image_file');
        const dimensions = imageDimensions(new Uint8Array(await blob.arrayBuffer()), blob.type);
        if (dimensions.width !== payload.imageWidth || dimensions.height !== payload.imageHeight || dimensions.width < 1200 || dimensions.height < 630) throw new Error('invalid_image_dimensions');
      }
      const values = { workspace_id: workspaceId, kind, draft_payload: payload, updated_by: user.id, ...(row ? {} : { id, created_by: user.id, sort_order: 1000 }) };
      const result = row ? await admin.from('portfolio_items').update(values).eq('workspace_id', workspaceId).eq('id', id).select('*').single() : await admin.from('portfolio_items').insert(values).select('*').single();
      if (result.error) throw result.error;
      return respond(request, { item: result.data }, row ? 200 : 201);
    }
    if (action === 'publish') {
      if (row.kind === 'client' && body.consent_confirmed !== true) throw new Error('consent_required');
      const payload = validatePortfolioPayload(row.draft_payload, row.kind, workspaceId as string, id as string);
      let published = payload;
      if (row.kind === 'client') {
        const downloaded = await admin.storage.from('portfolio-drafts').download(payload.imagePath);
        if (downloaded.error || !downloaded.data) throw new Error('invalid_image_path');
        const blob = downloaded.data;
        if (!types.has(blob.type) || blob.size > 5 * 1024 * 1024) throw new Error('invalid_image_file');
        const dimensions = imageDimensions(new Uint8Array(await blob.arrayBuffer()), blob.type);
        if (dimensions.width !== payload.imageWidth || dimensions.height !== payload.imageHeight || dimensions.width < 1200 || dimensions.height < 630) throw new Error('invalid_image_dimensions');
        const extension = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg';
        const publicPath = `${workspaceId}/${id}/${crypto.randomUUID()}.${extension}`;
        const upload = await admin.storage.from('portfolio-covers').upload(publicPath, blob, { contentType: blob.type, upsert: false });
        if (upload.error) throw new Error('cover_publish_failed');
        published = { ...payload, imagePath: admin.storage.from('portfolio-covers').getPublicUrl(publicPath).data.publicUrl };
      }
      const now = new Date().toISOString();
      const update = await admin.from('portfolio_items').update({ status: 'published', published_payload: published, published_at: row.published_at || now, published_by: user.id, archived_at: null, consent_confirmed_at: row.kind === 'client' ? now : null, consent_confirmed_by: row.kind === 'client' ? user.id : null }).eq('workspace_id', workspaceId).eq('id', id);
      if (update.error) throw update.error;
      const deployment = await requestPortfolioDeploy(admin, id as string, workspaceId as string, 'publish');
      return respond(request, { ok: true, ...deployment });
    }
    if (action === 'archive') {
      const update = await admin.from('portfolio_items').update({ status: 'archived', archived_at: new Date().toISOString() }).eq('workspace_id', workspaceId).eq('id', id);
      if (update.error) throw update.error;
      const deployment = await requestPortfolioDeploy(admin, id as string, workspaceId as string, 'archive');
      return respond(request, { ok: true, ...deployment });
    }
    if (row.deployment_status !== 'failed') throw new Error('invalid_retry');
    const deployment = await requestPortfolioDeploy(admin, id as string, workspaceId as string, 'retry');
    return respond(request, { ok: true, ...deployment });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown';
    return respond(request, { message: code }, portfolioErrorStatus(code));
  }
});
