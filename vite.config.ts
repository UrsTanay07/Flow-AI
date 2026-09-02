import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    define: {},
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2022',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-motion': ['motion/react'],
            'vendor-charts': ['recharts'],
            'vendor-map': ['leaflet', 'react-leaflet'],
          },
        },
      },
    },
    server: {
      // Node watch mode handles development restarts. Disabling Vite's separate
      // socket prevents port 24678 conflicts from stale editor sessions.
      hmr: false,
    },
  };
});
