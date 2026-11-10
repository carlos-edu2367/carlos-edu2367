/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const basePath = process.env.VITE_BASE_PATH || '/';

function preloadDisplayFontsPlugin(resolvedBase: string): Plugin {
  const normalizedBase = resolvedBase.endsWith('/') ? resolvedBase : `${resolvedBase}/`;
  let fontLinks: string[] = [];

  return {
    name: 'ce-preload-display-fonts',
    apply: 'build',
    generateBundle(_, bundle) {
      fontLinks = [];
      for (const fileName of Object.keys(bundle)) {
        if (
          fileName.endsWith('.woff2') &&
          (fileName.includes('syne-latin-800-normal') ||
            fileName.includes('space-grotesk-latin-wght-normal'))
        ) {
          fontLinks.push(`${normalizedBase}${fileName}`);
        }
      }
    },
    transformIndexHtml(html) {
      if (fontLinks.length === 0) {
        return html;
      }
      return {
        html,
        tags: fontLinks.map((href) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href,
            crossorigin: 'anonymous',
          },
          injectTo: 'head-prepend',
        })),
      };
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss(), preloadDisplayFontsPlugin(basePath)],
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('preload-helper')) {
            return 'vendor-react';
          }
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three') ||
            id.includes('node_modules/postprocessing') ||
            id.includes('node_modules/three-stdlib')
          ) {
            return 'vendor-three';
          }
          if (
            id.includes('node_modules/motion') ||
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/lenis')
          ) {
            return 'vendor-motion';
          }
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
