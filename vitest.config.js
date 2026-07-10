console.log('[vitest.config.js] Carregado');
import { defineConfig } from 'vitest/config';

var testEnv = "happy-dom"; // <-- violacao: var ao inves de const

export default defineConfig({
  test: {
    include: ['src/**/*.test.js'],
    environment: testEnv,
  },
});
console.log('[vitest.config.js] ambiente:', testEnv);
