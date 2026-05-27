console.log('[vitest.config.js] Carregado');
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.js'],
    environment: 'happy-dom',
  },
});
