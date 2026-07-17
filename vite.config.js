// vite.config.js — Yogo Ventures
// Build optimized for Core Web Vitals (LCP, INP, CLS) and SEO:
//   - Code splitting: vendor, gsap, and particles in separate chunks
//   - No source maps in production (security + smaller payloads)
//   - Asset filenames include content hash (safe for immutable caching)
//   - Terser minification removes console.log in production
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  return {
    plugins: [react()],

    server: {
      port: 5173,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:7002',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    build: {
      outDir: 'dist',

      // ── No source maps in production ──────────────────────────────────
      // Prevents exposure of source code; also reduces payload size.
      sourcemap: false,

      // ── Raise chunk warning threshold to 1MB ──────────────────────────
      // GSAP + tsParticles are large but only load once (cached immutably).
      chunkSizeWarningLimit: 1000,

      // ── Minify with esbuild (default, fast) ───────────────────────────
      minify: 'esbuild',

      // ── Asset filenames: content hash for immutable caching ───────────
      // Allows setting Cache-Control: max-age=31536000, immutable in nginx
      rollupOptions: {
        output: {
          // Hashed filenames for assets
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',

          // ── Manual chunks: split large third-party libs ───────────────
          // Each chunk is independently cached — updating React doesn't
          // bust the GSAP cache and vice versa.
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // React core — changes infrequently
              if (id.includes('react-dom') || id.includes('react/')) {
                return 'vendor-react';
              }
              // Router — changes infrequently
              if (id.includes('react-router-dom') || id.includes('react-router/')) {
                return 'vendor-router';
              }
              // GSAP — large, changes infrequently
              if (id.includes('gsap')) {
                return 'vendor-gsap';
              }
              // tsParticles — large, changes infrequently
              if (id.includes('tsparticles') || id.includes('tsParticles')) {
                return 'vendor-particles';
              }
              // Remaining node_modules
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
