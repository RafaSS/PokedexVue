import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['axios'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://pokeapi.co/api/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'happy-dom',
    globals:true,
  },
});