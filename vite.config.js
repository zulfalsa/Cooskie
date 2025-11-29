import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      react: path.resolve(process.cwd(), 'node_modules/react'),
      'react-dom': path.resolve(process.cwd(), 'node_modules/react-dom'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'icon.png'],

      manifest: {
        name: 'Cooskie App',
        short_name: 'Cooskie',
        description: 'Tugas Akhir Praktikum PPB',
        theme_color: '#1e3a8a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon.png', sizes: '512x512', type: 'image/png' }
        ]
      },

      workbox: {
        // ❗ HAPUS JS DAN CSS DARI PRECACHE → FIX WSOD
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,svg,png,ico,html}'],

        cleanupOutdatedCaches: true,

        // ❗ HAPUS PAKET SERVICE WORKER LAMA & BARU AGAR TIDAK ADA RACE
        clientsClaim: false,
        skipWaiting: false,

        runtimeCaching: [
          {
            // HTML → NetworkFirst supaya tidak pernah cache lama
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 3,
            }
          },
          {
            // JS & CSS → StaleWhileRevalidate (runtime only, NO precache)
            urlPattern: ({ request }) =>
              ['script', 'style', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'assets-cache' }
          },
          {
            // Images → CacheFirst
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              }
            }
          }
        ]
      },

      // ❗ Hanya aktifkan SW di prod. Mode dev = NO SERVICE WORKER.
      devOptions: {
        enabled: false,
      },
    }),
  ],
});