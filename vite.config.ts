import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import os from 'node:os';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    cacheDir: path.join(os.tmpdir(), 'flowai-vite-cache'),
    plugins: [react(), tailwindcss()],
    define: {},
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // Node watch mode handles development restarts. Disabling Vite's separate
      // socket prevents port 24678 conflicts from stale editor sessions.
      hmr: false,
    },
  };
});
