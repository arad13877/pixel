import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  optimizeDeps: { noDiscovery: true, include: [] },
  plugins: [react(), {
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
  publicDir: resolve(import.meta.dirname, 'public'),
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
