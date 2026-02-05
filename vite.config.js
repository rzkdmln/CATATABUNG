import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@react-native-community/datetimepicker': path.resolve(__dirname, 'src/components/WebDateTimePicker.jsx'),
      'react-native-chart-kit': path.resolve(__dirname, 'src/components/WebChartMock.jsx'),
      'react-native-calendars': path.resolve(__dirname, 'src/components/WebCalendarMock.jsx'),
    },
    extensions: ['.web.jsx', '.web.js', '.jsx', '.js', '.ts', '.tsx']
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
