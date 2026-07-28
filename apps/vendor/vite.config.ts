import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        react: resolve(__dirname, 'src/react.ts'),
        'react-dom-client': resolve(__dirname, 'src/react-dom-client.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.mjs`,
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
