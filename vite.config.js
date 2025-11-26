import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // Forces all libraries to use the single copy of React in your root node_modules
      react: path.resolve(process.cwd(), 'node_modules/react'),
      'react-dom': path.resolve(process.cwd(), 'node_modules/react-dom'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'LOGORN.png'], // Pastikan nama file sesuai dengan yang ada di folder public

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'cooskie', // Menggunakan nama dari konfigurasi pertama Anda
        short_name: 'cooskie',
        description: 'Tugas Akhir Praktikum PPB', // Deskripsi dari konfigurasi pertama
        theme_color: '#ffffff',
        // Icon akan di-generate otomatis oleh pwaAssets atau Anda bisa mendefinisikannya manual di sini jika pwaAssets disabled
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false, // Set ke true jika ingin testing PWA di mode development
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
});