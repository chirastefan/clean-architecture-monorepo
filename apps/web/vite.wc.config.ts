import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-wc',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/main.wc.tsx'),
      name: 'WebComponents',
      fileName: () => 'budget-tracker.js',
      formats: ['es'], // Output modern ES module
    },
    rollupOptions: {
      // Externalize React dependencies so they are loaded via Import Map
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'budget-tracker.css';
          return assetInfo.name || 'asset.[ext]';
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
