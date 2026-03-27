// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    strictPort: true,

    proxy: {
      // Authentication Service
      '/api/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/api/auth'), // Keep the full path
      },

      // Onboarding Service (for future use)
      '/api/onboarding': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/onboarding/, '/api/onboarding'),
      },

      // Optional: Catch-all for any other /api routes (good future-proofing)
      '/api': {
        target: 'http://localhost:5001',   // Default to auth service
        changeOrigin: true,
        secure: false,
      }
    }
  }
});