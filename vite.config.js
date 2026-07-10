console.log('[vite.config.js] Carregado');
import { defineConfig } from 'vite';

var vitePort = 3000; // <-- violacao: var ao inves de const

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
console.log('[vite.config.js] Config exportada');
console.log('[vite.config.js] porta:', vitePort);
