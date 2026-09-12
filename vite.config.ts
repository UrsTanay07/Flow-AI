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
          manualChunks(id) {
            const moduleId = id.replaceAll('\\', '/');
            if (!moduleId.includes('/node_modules/')) return;
            if (/\/(motion|framer-motion)\//.test(moduleId)) return 'vendor-motion';
            if (moduleId.includes('/recharts/')) return 'vendor-charts';
            if (/\/(leaflet|react-leaflet)\//.test(moduleId)) return 'vendor-map';
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
