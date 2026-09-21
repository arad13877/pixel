import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App';
import { articles } from './src/articles.generated';
import { resolve } from 'node:path';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const safeJson = (value: unknown) => JSON.stringify(value).replaceAll('<', '\\u003c');

function articleMetadata(slug: string) {
  const article = articles.find(item => item.slug === slug);
  if (!article) throw new Error(`Missing generated article payload for ${slug}`);
  const canonical = `https://pxlgrid.design/articles/${article.slug}/`;
  const image = article.coverData?.kind === 'image' ? `<meta property="og:image" content="${escapeHtml(article.coverData.url)}"/><meta property="og:image:alt" content="${escapeHtml(article.coverData.alt)}"/>` : '';
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: article.title, description: article.seoDescription || article.excerpt, datePublished: article.publishedAt, dateModified: article.modifiedAt || article.publishedAt, inLanguage: 'fa-IR', author: { '@type': 'Organization', name: article.authorName || 'تحریریه پیکسل' }, publisher: { '@type': 'Organization', name: 'پیکسل', url: 'https://pxlgrid.design/' }, mainEntityOfPage: canonical, ...(article.coverData?.kind === 'image' ? { image: article.coverData.url } : {}) },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'پیکسل', item: 'https://pxlgrid.design/' },
      { '@type': 'ListItem', position: 2, name: 'مقالات', item: 'https://pxlgrid.design/articles/' },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
    ] },
  ] };
  return `<title>${escapeHtml(article.seoTitle || `${article.title} | پیکسل`)}</title><meta name="description" content="${escapeHtml(article.seoDescription || article.excerpt)}"/><link rel="canonical" href="${canonical}"/><meta property="og:type" content="article"/><meta property="og:locale" content="fa_IR"/><meta property="og:site_name" content="پیکسل"/><meta property="og:title" content="${escapeHtml(article.title)}"/><meta property="og:description" content="${escapeHtml(article.ogDescription || article.excerpt)}"/><meta property="og:url" content="${canonical}"/><meta property="article:published_time" content="${escapeHtml(article.publishedAt)}"/><meta property="article:modified_time" content="${escapeHtml(article.modifiedAt || article.publishedAt)}"/><meta property="article:author" content="${escapeHtml(article.authorName || 'تحریریه پیکسل')}"/>${image}<script type="application/ld+json">${safeJson(schema)}</script>`;
}

function archiveSchema() {
  return safeJson({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'مقالات پیکسل', itemListElement: articles.map((article, index) => ({ '@type': 'ListItem', position: index + 1, url: `https://pxlgrid.design/articles/${article.slug}/`, name: article.title })) });
}

function sitemap() {
  const staticUrls = ['/', '/web-design/', '/portfolio/', '/request/', '/articles/'];
  const urls = [...staticUrls.map(path => `<url><loc>https://pxlgrid.design${path}</loc></url>`), ...articles.map(article => `<url><loc>https://pxlgrid.design/articles/${article.slug}/</loc><lastmod>${(article.modifiedAt || article.publishedAt).slice(0, 10)}</lastmod></url>`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls.join('\n  ')}\n</urlset>\n`;
}

const articleInputs = Object.fromEntries(articles.map(article => [`article-${article.slug}`, resolve(import.meta.dirname, `.generated/articles/${article.slug}/index.html`)]));

export default defineConfig({
  optimizeDeps: { noDiscovery: true, include: [] },
  plugins: [react(), {
    name: 'pixel-static-html',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const match = request.url?.match(/^\/articles\/([^/?#]+)\/?(?:[?#].*)?$/);
        if (match) request.url = `/.generated/articles/${match[1]}/index.html`;
        next();
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const articleMatch = context.path.match(/^\/(?:\.generated\/)?articles\/([^/]+)(?:\/|\/index\.html)/);
        const page = articleMatch ? 'article' : context.path.startsWith('/articles') ? 'articles' : context.path.startsWith('/web-design') ? 'web-design' : context.path.startsWith('/portfolio') ? 'portfolio' : context.path.startsWith('/request') ? 'request' : 'home';
        let output = html.replace('<!--app-html-->', renderToString(createElement(App, { page, articleSlug: articleMatch?.[1] })));
        if (articleMatch) output = output.replace('<!--article-meta-->', articleMetadata(articleMatch[1]));
        if (page === 'articles') output = output.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${archiveSchema()}</script>`);
        return output;
      },
    },
    generateBundle(_options, bundle) {
      const map = bundle['sitemap.xml'];
      if (map?.type === 'asset') map.source = sitemap();
    },
    async closeBundle() {
      const generated = resolve(import.meta.dirname, 'dist/.generated/articles');
      const destination = resolve(import.meta.dirname, 'dist/articles');
      await mkdir(destination, { recursive: true });
      for (const article of articles) await cp(resolve(generated, article.slug), resolve(destination, article.slug), { recursive: true, force: true });
      await rm(resolve(import.meta.dirname, 'dist/.generated'), { recursive: true, force: true });
      await writeFile(resolve(import.meta.dirname, 'dist/sitemap.xml'), sitemap(), 'utf8');
    },
  }, {
    name: 'pixel-inline-request-css',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const page = bundle['request/index.html'];
      if (!page || page.type !== 'asset' || typeof page.source !== 'string') return;
      page.source = page.source.replace(/<link rel="stylesheet" crossorigin href="\/(assets\/[^\"]+\.css)">/g, (tag, file: string) => {
        const stylesheet = bundle[file];
        if (!stylesheet || stylesheet.type !== 'asset') return tag;
        const css = typeof stylesheet.source === 'string' ? stylesheet.source : Buffer.from(stylesheet.source).toString('utf8');
        return `<style>${css}</style>`;
      });
    },
  }],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        webDesign: resolve(import.meta.dirname, 'web-design/index.html'),
        portfolio: resolve(import.meta.dirname, 'portfolio/index.html'),
        request: resolve(import.meta.dirname, 'request/index.html'),
        articles: resolve(import.meta.dirname, 'articles/index.html'),
        ...articleInputs,
      },
    },
  },
});
