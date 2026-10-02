import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import { publicPages, demoPaths, isPublicArticleSlug, siteOrigin } from '../src/seo.ts';

const fail = message => { throw new Error(`SEO validation: ${message}`); };
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]));
async function walk(root) {
  const entries = await readdir(root, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(resolve(root, entry.name)) : [resolve(root, entry.name)]))).flat();
}

export async function validateSeo(directory = 'dist', { http = false, baseUrl } = {}) {
  const root = resolve(directory);
  const files = await walk(root);
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
  if (!sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') || !sitemap.includes('</urlset>')) fail('invalid sitemap document');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
  if (!urls.length || new Set(urls).size !== urls.length) fail('empty or duplicate sitemap URLs');
  const pages = new Map();
  const titles = new Set();
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const name = relative(root, file).split(sep).join('/');
    if (!name.endsWith('index.html')) fail(`unexpected HTML route ${name}`);
    const path = '/' + name.replace(/index\.html$/, '');
    const html = await readFile(file, 'utf8');
    const metas = tags(html, 'meta');
    const noindex = metas.some(meta => meta.name?.toLowerCase() === 'robots' && /\bnoindex\b/i.test(meta.content || ''));
    const canonicalTags = tags(html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '', 'link').filter(link => link.rel === 'canonical');
    const expected = siteOrigin + path;
    const demo = demoPaths.includes(path);
    const article = path.match(/^\/articles\/([^/]+)\/$/);
    if (article && !isPublicArticleSlug(article[1])) fail(`non-public article ${path}`);
    if (!demo && !article && !publicPages.some(page => page.path === path)) fail(`unregistered public/internal route ${path}`);
    if (!/<title\b[^>]*>\s*[^<\s][\s\S]*?<\/title>/i.test(html)) fail(`missing title ${path}`);
    if (!metas.some(meta => meta.name === 'description' && meta.content?.trim())) fail(`missing description ${path}`);
    if ((html.match(/<h1\b/gi) || []).length !== 1) fail(`expected one H1 ${path}`);
    if (demo !== noindex) fail(`unexpected indexability ${path}`);
    if (noindex) {
      if (urls.includes(expected)) fail(`noindex page in sitemap ${path}`);
    } else {
      const title = decode(html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '').trim();
      if (titles.has(title)) fail(`duplicate public title ${path}`);
      titles.add(title);
      if (metas.some(meta => meta.name === 'robots' && /\bnofollow\b/i.test(meta.content || ''))) fail(`public page has nofollow ${path}`);
      if (canonicalTags.length !== 1 || canonicalTags[0].href !== expected) fail(`canonical mismatch ${path}; expected ${expected}`);
      if (!urls.includes(expected)) fail(`indexable page missing from sitemap ${path}`);
      for (const property of ['og:title', 'og:description', 'og:type', 'og:url']) {
        const matches = metas.filter(meta => meta.property === property);
        if (matches.length !== 1 || !matches[0].content || (property === 'og:url' && matches[0].content !== expected)) fail(`missing/incorrect ${property} ${path}`);
      }
      for (const meta of metas.filter(meta => meta.property === 'og:image')) {
        const image = new URL(meta.content);
        if (image.protocol !== 'https:') fail(`insecure OG image ${path}`);
        if (image.origin === siteOrigin && !files.includes(resolve(root, '.' + image.pathname))) fail(`missing OG image ${path}`);
      }
    }
    for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      try { JSON.parse(match[1]); } catch { fail(`invalid JSON-LD ${path}`); }
    }
    const links = tags(html, 'a').flatMap(link => {
      if (!link.href) return [];
      const url = new URL(link.href, expected);
      return url.origin === siteOrigin ? [url] : [];
    });
    pages.set(path, { html, noindex, links });
  }
  for (const page of publicPages) if (!pages.has(page.path)) fail(`missing public route ${page.path}`);
  for (const path of demoPaths) if (!pages.get(path)?.noindex) fail(`demo must remain noindex ${path}`);
  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.origin !== siteOrigin || parsed.search || parsed.hash || parsed.username || parsed.password) fail(`non-canonical sitemap URL ${url}`);
    if (!pages.has(parsed.pathname) || pages.get(parsed.pathname).noindex) fail(`sitemap target missing, private or noindex ${url}`);
  }
  for (const [path, page] of pages) for (const link of page.links) {
    const target = pages.get(link.pathname);
    if (!target) fail(`broken internal link ${path} → ${link.pathname}`);
    if (link.hash && !tags(target.html, '[a-z][a-z0-9]*').some(tag => tag.id === decodeURIComponent(link.hash.slice(1)))) fail(`broken anchor ${path} → ${link.href}`);
  }
  const reachable = new Set(['/']);
  const queue = ['/'];
  while (queue.length) for (const link of pages.get(queue.shift()).links) {
    if (!reachable.has(link.pathname)) { reachable.add(link.pathname); queue.push(link.pathname); }
  }
  for (const [path, page] of pages) if (!page.noindex && !reachable.has(path)) fail(`indexable route unreachable from Home ${path}`);
  const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
  if (!robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`) || /^Disallow:\s*\/$/mi.test(robots)) fail('public robots blocks crawling or lacks sitemap');
  const disallows = [...robots.matchAll(/^Disallow:\s*(\/\S*)\s*$/gmi)].map(match => match[1]);
  const allows = [...robots.matchAll(/^Allow:\s*(\/\S*)\s*$/gmi)].map(match => match[1]);
  for (const url of urls) {
    const path = new URL(url).pathname;
    const blocked = Math.max(-1, ...disallows.filter(rule => path.startsWith(rule)).map(rule => rule.length));
    const allowed = Math.max(-1, ...allows.filter(rule => path.startsWith(rule)).map(rule => rule.length));
    if (blocked > allowed) fail(`robots blocks sitemap URL ${url}`);
  }
  let server;
  if (http) {
    let origin = baseUrl;
    if (!origin) {
      server = createServer(async (request, response) => {
        try {
          const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
          const file = resolve(root, '.' + path, path.endsWith('/') ? 'index.html' : '');
          if (!file.startsWith(root + sep) || !(await stat(file)).isFile()) { response.writeHead(404).end(); return; }
          response.writeHead(200, { 'Content-Type': file.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/xml' });
          response.end(await readFile(file));
        } catch { response.writeHead(404).end(); }
      });
      await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
      origin = `http://127.0.0.1:${server.address().port}`;
    }
    try {
      for (const url of urls) {
        const response = await fetch(origin.replace(/\/$/, '') + new URL(url).pathname, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
        if (response.status !== 200) fail(`HTTP ${response.status} for ${url}`);
        const html = await response.text();
        if (/noindex/i.test(response.headers.get('x-robots-tag') || '') || tags(html, 'meta').some(meta => meta.name === 'robots' && /noindex/i.test(meta.content || ''))) fail(`HTTP noindex ${url}`);
        if (!tags(html, 'link').some(link => link.rel === 'canonical' && link.href === url)) fail(`HTTP canonical mismatch ${url}`);
      }
    } finally { if (server) await new Promise(resolve => server.close(resolve)); }
  }
  return { indexable: urls.length, noindex: [...pages.values()].filter(page => page.noindex).length, sitemap: urls.length, http: http ? (baseUrl || 'local artifact server') : 'not requested' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const baseIndex = process.argv.indexOf('--base-url');
  console.log('PASS SEO:', await validateSeo(process.env.SEO_DIST || 'dist', { http: true, baseUrl: baseIndex >= 0 ? process.argv[baseIndex + 1] : undefined }));
}
