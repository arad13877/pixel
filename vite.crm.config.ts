import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { cp, readFile, access } from 'node:fs/promises';

export default defineConfig({
  optimizeDeps: { noDiscovery: true, include: [] },
  plugins: [react(), {
    name: 'pixel-crm-public-assets',
    async closeBundle() {
      const output = resolve(import.meta.dirname, 'crm/dist');
      // Keep concept previews available without copying the public site's robots/sitemap.
      await cp(resolve(import.meta.dirname, 'public/images'), resolve(output, 'images'), { recursive: true });
      await cp(resolve(import.meta.dirname, 'public/liquid-glass-noise.svg'), resolve(output, 'liquid-glass-noise.svg'));
      const html = await readFile(resolve(output, 'index.html'), 'utf8');
      const robots = await readFile(resolve(output, 'robots.txt'), 'utf8');
      if (!html.includes('noindex,nofollow,noarchive') || /Sitemap:|Disallow:\s*\//i.test(robots)) throw new Error('CRM SEO: keep noindex metadata, allow crawling, and exclude public sitemap');
      if (await access(resolve(output, 'sitemap.xml')).then(() => true, () => false)) throw new Error('CRM SEO: public sitemap must not be copied');
    },
  }, {
    name: 'pixel-inline-crm-css',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const page = bundle['index.html'];
      if (!page || page.type !== 'asset' || typeof page.source !== 'string') return;
      page.source = page.source.replace(/<link rel="stylesheet" crossorigin href="\/(assets\/[^\"]+\.css)">/g, (tag, file: string) => {
        const stylesheet = bundle[file];
        if (!stylesheet || stylesheet.type !== 'asset') return tag;
        const css = typeof stylesheet.source === 'string' ? stylesheet.source : Buffer.from(stylesheet.source).toString('utf8');
        return `<style>${css}</style>`;
      });
    },
  }],
  root: resolve(import.meta.dirname, 'crm'),
  publicDir: resolve(import.meta.dirname, 'crm/public'),
  build: {
    outDir: resolve(import.meta.dirname, 'crm/dist'),
    emptyOutDir: true,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('react-router')) return 'router';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react';
        },
      },
    },
  },
});
