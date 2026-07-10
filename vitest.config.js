console.log('[vitest.config.js] Carregado');
var testEnv = "happy-dom"; // <-- violacao: var ao inves de const
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.js'],
    environment: testEnv,
  },
});
console.log('[vitest.config.js] ambiente:', testEnv);
