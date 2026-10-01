// Credentials stay in the Edge Function runtime, never in the public build.
export async function dispatchPublicSite(inputs: { source: string; record_id: string; action: string }) {
  if (Deno.env.get('PUBLIC_SITE_DEPLOY_MODE') === 'github') {
    const token = Deno.env.get('PUBLIC_SITE_GITHUB_TOKEN');
    const ref = Deno.env.get('PUBLIC_SITE_GITHUB_REF');
    if (!token || !ref) throw new Error('missing_github_deploy_configuration');
    const response = await fetch('https://api.github.com/repos/arad13877/pixel/actions/workflows/publish-cpanel.yml/dispatches', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20000),
      headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'content-type': 'application/json', 'X-GitHub-Api-Version': '2026-03-10', 'User-Agent': 'pixel-crm-publisher' },
      body: JSON.stringify({ ref, inputs: { ...inputs, dry_run: 'false' } }),
    });
    if (!response.ok) throw new Error(`github_dispatch_${response.status}`);
    const body = await response.json().catch(() => ({})) as Record<string, unknown>;
    return { status: response.status, requestId: typeof body.workflow_run_id === 'number' ? String(body.workflow_run_id) : null };
  }
  const hook = Deno.env.get('PUBLIC_SITE_DEPLOY_HOOK_URL');
  if (!hook) throw new Error('missing_deploy_hook');
  const response = await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(20000), headers: { 'content-type': 'application/json' }, body: JSON.stringify({ source: 'pixel-crm', ...inputs }) });
  if (!response.ok) throw new Error(`deploy_hook_${response.status}`);
  const body = await response.json().catch(() => ({})) as Record<string, unknown>;
  const job = body.job as Record<string, unknown> | undefined;
  return { status: response.status, requestId: typeof job?.id === 'string' ? job.id : typeof body.id === 'string' ? body.id : null };
}
