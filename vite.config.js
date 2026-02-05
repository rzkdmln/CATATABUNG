import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Memaksa plugin react untuk memproses file .js sebagai JSX
      jsxRuntime: 'automatic',
      include: /\.(js|jsx|ts|tsx)$/,
    })
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.js', '.js', '.jsx', '.ts', '.tsx']
  },
  esbuild: {
    // Memaksa esbuild (untuk dev) menggunakan loader JSX untuk file .js
    loader: 'jsx',
    include: /src\/.*\.js$|App\.js$|index\.js$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      resolveExtensions: ['.web.js', '.js', '.jsx', '.ts', '.tsx']
    },
  },
  define: {
    global: 'window',
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});
