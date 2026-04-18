import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '/soundhub-app/',
  resolve: {
    alias: {
      // Force ALL imports — including those from ../../src/... — to use
      // ONE single copy of each library. Without this, files resolved from
      // the root src/ directory pick up root/node_modules/react while
      // soundhub-app/main.tsx uses soundhub-app/node_modules/react,
      // causing a duplicate-React crash (invalid hook call / Error with no message).
      'react': resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
      'react-router-dom': resolve(__dirname, 'node_modules/react-router-dom'),
      'framer-motion': resolve(__dirname, 'node_modules/framer-motion'),
    },
  },
  build: {
    outDir: '.',
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/main.[ext]',
      },
    },
  },
});
