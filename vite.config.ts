import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App';
import { resolve } from 'node:path';

export default defineConfig({
  optimizeDeps: { noDiscovery: true, include: [] },
  plugins: [react(), {
    name: 'pixel-static-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const articleMatch = context.path.match(/^\/articles\/([^/]+)(?:\/|\/index\.html)/);
        const page = articleMatch ? 'article' : context.path.startsWith('/articles') ? 'articles' : context.path.startsWith('/web-design') ? 'web-design' : context.path.startsWith('/portfolio') ? 'portfolio' : context.path.startsWith('/request') ? 'request' : 'home';
        return html.replace('<!--app-html-->', renderToString(createElement(App, { page, articleSlug: articleMatch?.[1] })));
      },
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
        articleWebsite: resolve(import.meta.dirname, 'articles/why-business-needs-website/index.html'),
        articleCost: resolve(import.meta.dirname, 'articles/website-design-cost-guide/index.html'),
        articleAgent: resolve(import.meta.dirname, 'articles/ai-agent-for-business/index.html'),
      },
    },
  },
});
