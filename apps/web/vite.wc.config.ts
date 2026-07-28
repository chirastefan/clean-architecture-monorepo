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
      formats: ['iife'], // output a self-executing script suitable for legacy PHP
    },
    rollupOptions: {
      // For web components that bundle everything, we do NOT externalize React.
      // We want React included in the iife bundle.
      // If we wanted to externalize it, we'd add 'react', 'react-dom' here.
      output: {
        // We ensure CSS is extracted cleanly
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'budget-tracker.css';
          return assetInfo.name || 'asset.[ext]';
        },
      },
    },
  },
  define: {
    // This is often needed for React in a production iife bundle
    'process.env.NODE_ENV': '"production"',
  },
});
