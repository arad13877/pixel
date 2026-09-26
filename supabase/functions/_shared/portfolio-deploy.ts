import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.116.0';

export async function requestPortfolioDeploy(admin: SupabaseClient, itemId: string, workspaceId: string, action: string) {
  const hook = Deno.env.get('PUBLIC_SITE_DEPLOY_HOOK_URL');
  await admin.from('portfolio_items').update({ deployment_status: 'pending', deployment_error: null, deployment_requested_at: new Date().toISOString() }).eq('id', itemId).eq('workspace_id', workspaceId);
  try {
    if (!hook) throw new Error('missing_deploy_hook');
    const response = await fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ source: 'pixel-crm', portfolio_id: itemId, action }) });
    if (!response.ok) throw new Error(`deploy_hook_${response.status}`);
    await admin.from('portfolio_items').update({ deployment_status: 'requested', deployment_error: null }).eq('id', itemId).eq('workspace_id', workspaceId);
    return { deployment_status: 'requested' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'deploy_failed';
    await admin.from('portfolio_items').update({ deployment_status: 'failed', deployment_error: message }).eq('id', itemId).eq('workspace_id', workspaceId);
    throw new Error(message);
  }
}
