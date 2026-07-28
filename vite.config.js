import { defineConfig } from 'vite';

const vitePort = 3000;

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: vitePort,
    open: true,
  },
});
