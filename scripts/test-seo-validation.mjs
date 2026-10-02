import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, rm, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateSeo } from './validate-seo.mjs';

async function rejectsMutation(mutate, pattern) {
  const root = await mkdtemp(join(tmpdir(), 'pixel-seo-'));
  try {
    await cp('dist', root, { recursive: true });
    await mutate(root);
    await assert.rejects(validateSeo(root), pattern);
  } finally { await rm(root, { recursive: true, force: true }); }
}
const rewrite = async (root, file, mutate) => writeFile(join(root, file), mutate(await readFile(join(root, file), 'utf8')));
test('valid built artifact passes', async () => assert.ok((await validateSeo()).indexable > 0));
test('missing canonical fails', () => rejectsMutation(root => rewrite(root, 'index.html', html => html.replace(/<link[^>]*rel="canonical"[^>]*>/, '')), /canonical mismatch/));
test('duplicate sitemap URL fails', () => rejectsMutation(root => rewrite(root, 'sitemap.xml', xml => xml.replace('</urlset>', '<url><loc>https://pxlgrid.design/</loc></url></urlset>')), /duplicate sitemap/));
test('noindex commercial page fails', () => rejectsMutation(root => rewrite(root, 'index.html', html => html.replace('</head>', '<meta name="robots" content="noindex"/></head>')), /indexability/));
test('demo URL in sitemap fails', () => rejectsMutation(root => rewrite(root, 'sitemap.xml', xml => xml.replace('</urlset>', '<url><loc>https://pxlgrid.design/portfolio/roma/</loc></url></urlset>')), /noindex page in sitemap/));
test('CRM URL in sitemap fails', () => rejectsMutation(root => rewrite(root, 'sitemap.xml', xml => xml.replace('</urlset>', '<url><loc>https://crm.pxlgrid.design/</loc></url></urlset>')), /non-canonical sitemap URL/));
test('test article route fails', () => rejectsMutation(root => rewrite(root, 'sitemap.xml', xml => xml.replace('</urlset>', '<url><loc>https://pxlgrid.design/articles/crm-upload-check-20261001/</loc></url></urlset>')), /sitemap target missing/));
test('missing route fails', () => rejectsMutation(root => rm(join(root, 'web-design-gorgan/index.html')), /missing public route/));
test('test HTML artifact fails even outside sitemap', () => rejectsMutation(async root => {
  await mkdir(join(root, 'articles/crm-upload-check-20261001'), { recursive: true });
  await cp(join(root, 'articles/why-business-needs-website/index.html'), join(root, 'articles/crm-upload-check-20261001/index.html'));
}, /non-public article/));
test('robots blocking a public cluster fails', () => rejectsMutation(root => rewrite(root, 'robots.txt', robots => robots + '\nDisallow: /web-design-gorgan/\n'), /robots blocks sitemap/));
