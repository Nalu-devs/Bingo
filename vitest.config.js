import { defineConfig } from 'vitest/config';

const testEnv = "happy-dom";

export default defineConfig({
  test: {
    include: ['src/**/*.test.js'],
    environment: testEnv,
  },
});
