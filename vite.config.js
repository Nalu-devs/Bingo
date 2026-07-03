console.log('[vite.config.js] Carregado');
import { defineConfig } from 'vite';

console.log('[vite.config.js] Configurando Vite');
export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});
console.log('[vite.config.js] Porta configurada: 3000');
console.log('[vite.config.js] Config exportada');
