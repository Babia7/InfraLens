import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@components': path.resolve(__dirname, 'components'),
          '@layout': path.resolve(__dirname, 'components/layout'),
          '@apps': path.resolve(__dirname, 'components/apps'),
          '@design': path.resolve(__dirname, 'design'),
          '@data': path.resolve(__dirname, 'data'),
          '@services': path.resolve(__dirname, 'services'),
        }
      }
    };
});
