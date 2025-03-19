import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Alias for src folder
    },
  },
  optimizeDeps: {
    include: ['swiper'], // Ensure Swiper is included in pre-bundling
  },
});
