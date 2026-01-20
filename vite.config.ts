import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    minify: 'terser',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});
