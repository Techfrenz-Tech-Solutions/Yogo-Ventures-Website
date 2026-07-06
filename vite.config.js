import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,   // fail fast if 5173 is already in use
    open: true,
    proxy: {
      '/api': {
        // Local backend. Override with VITE_PROXY_TARGET in .env if the API
        // is on another machine (e.g. http://192.168.x.x:7002).
        target: env.VITE_PROXY_TARGET || 'http://localhost:7002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          gsap: ['gsap'],
        },
      },
    },
  },
  };
})
