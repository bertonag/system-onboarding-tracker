import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, ''),
      },
      '/api/onboarding': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/onboarding/, ''),
      },
    },
  },
});