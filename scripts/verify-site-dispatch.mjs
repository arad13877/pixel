import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const text = await readFile('supabase/functions/_shared/site-dispatch.ts', 'utf8');
// Strip only TypeScript annotations to exercise the actual implementation without Deno.
const js = text.replace('export async function', 'async function').replace('inputs: { source: string; record_id: string; action: string }', 'inputs').replaceAll(' as Record<string, unknown> | undefined', '').replaceAll(' as Record<string, unknown>', '');
const env = new Map([['PUBLIC_SITE_DEPLOY_MODE', 'github'], ['PUBLIC_SITE_GITHUB_TOKEN', 'test-runtime-only'], ['PUBLIC_SITE_GITHUB_REF', 'codex/cpanel-publication']]);
let calls = 0;
let status = 200;
const fakeFetch = async (url, options) => {
  calls++;
  assert.equal(url, 'https://api.github.com/repos/arad13877/pixel/actions/workflows/publish-cpanel.yml/dispatches');
  assert.equal(options.headers.authorization, 'Bearer test-runtime-only');
  assert.equal(JSON.parse(options.body).inputs.dry_run, 'false');
  assert.equal(JSON.parse(options.body).ref, 'codex/cpanel-publication');
  return new Response(JSON.stringify({ workflow_run_id: 123 }), { status });
};
const dispatch = new Function('Deno', 'fetch', js + '; return dispatchPublicSite;')({ env: { get: name => env.get(name) } }, fakeFetch);
assert.deepEqual(await dispatch({ source: 'article', record_id: 'test', action: 'publish' }), { status: 200, requestId: '123' });
status = 403;
await assert.rejects(dispatch({ source: 'article', record_id: 'test', action: 'publish' }), /github_dispatch_403/);
env.delete('PUBLIC_SITE_GITHUB_TOKEN');
await assert.rejects(dispatch({ source: 'article', record_id: 'test', action: 'publish' }), /missing_github_deploy_configuration/);
assert.equal(calls, 2);
console.log('PASS: runtime-only credentials, fixed repository, dispatch, failure, missing secret.');
