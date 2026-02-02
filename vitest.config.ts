import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@components': path.resolve(__dirname, 'components'),
      '@layout': path.resolve(__dirname, 'components/layout'),
      '@apps': path.resolve(__dirname, 'components/apps'),
      '@design': path.resolve(__dirname, 'design'),
      '@data': path.resolve(__dirname, 'data'),
      '@services': path.resolve(__dirname, 'services')
    }
  }
});
