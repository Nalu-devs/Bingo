console.log('[vitest.config.js] Carregado');
import { defineConfig } from 'vitest/config';

console.log('[vitest.config.js] Configurando Vitest');
export default defineConfig({
  test: {
    include: ['src/**/*.test.js'],
    environment: 'happy-dom',
  },
});
console.log('[vitest.config.js] Environment: happy-dom');
