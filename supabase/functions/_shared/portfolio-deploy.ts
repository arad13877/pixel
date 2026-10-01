import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.116.0';
import { dispatchPublicSite } from './site-dispatch.ts';

export async function requestPortfolioDeploy(admin: SupabaseClient, itemId: string, workspaceId: string, action: string) {
  await admin.from('portfolio_items').update({ deployment_status: 'pending', deployment_error: null, deployment_requested_at: new Date().toISOString() }).eq('id', itemId).eq('workspace_id', workspaceId);
  if (Deno.env.get('PUBLIC_SITE_DEPLOY_MODE') === 'manual') return { deployment_status: 'pending', deployment_mode: 'manual' };
  try {
    await dispatchPublicSite({ source: 'portfolio', record_id: itemId, action });
    await admin.from('portfolio_items').update({ deployment_status: 'requested', deployment_error: null }).eq('id', itemId).eq('workspace_id', workspaceId);
    return { deployment_status: 'requested' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'deploy_failed';
    await admin.from('portfolio_items').update({ deployment_status: 'failed', deployment_error: message }).eq('id', itemId).eq('workspace_id', workspaceId);
    throw new Error(message);
  }
}
