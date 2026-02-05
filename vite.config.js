import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Pastikan Babel memproses JSX di file .js
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ],
      },
    })
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  esbuild: {
    // Agar Vite dev server mengenali JSX di .js
    loader: 'jsx',
    include: /src\/.*\.js$|App\.js$|index\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  define: {
    global: 'window',
  },
});
