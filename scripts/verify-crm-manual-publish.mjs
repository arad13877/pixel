import assert from 'node:assert/strict';
import { requestArticleDeploy } from '../supabase/functions/_shared/article-deploy.ts';
import { requestPortfolioDeploy } from '../supabase/functions/_shared/portfolio-deploy.ts';

const calls = [];
globalThis.Deno = { env: { get: name => name === 'PUBLIC_SITE_DEPLOY_MODE' ? 'manual' : undefined } };
globalThis.fetch = () => { throw new Error('A manual publication must not call a deploy hook.'); };
const admin = {
  from(table) {
    return {
      update(values) {
        calls.push({ table, operation: 'update', values });
        return this;
      },
      eq() { return this; },
      then(resolve) { resolve({ error: null }); },
      async insert(values) {
        calls.push({ table, operation: 'insert', values });
        return { error: null };
      },
    };
  },
};

const article = await requestArticleDeploy(admin, { id: 'article-id', workspace_id: 'workspace-id' }, 'user-id', 'publish');
assert.deepEqual(article, { deployment_status: 'pending', deployment_mode: 'manual' });
assert.equal(calls.find(call => call.table === 'article_publication_events')?.values.hook_status, 'pending');
assert.equal(calls.find(call => call.table === 'articles')?.values.deployment_status, 'pending');

const portfolio = await requestPortfolioDeploy(admin, 'portfolio-id', 'workspace-id', 'publish');
assert.deepEqual(portfolio, { deployment_status: 'pending', deployment_mode: 'manual' });
assert.equal(calls.find(call => call.table === 'portfolio_items')?.values.deployment_status, 'pending');
console.log('Manual CRM publication records pending status without calling a deploy hook.');
