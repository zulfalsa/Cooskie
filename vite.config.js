import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'LOGORN.png'],

      manifest: {
        name: 'Cooskie',
        short_name: 'Cooskie',
        description: 'Nikmati cookies & dessert terbaik',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        
        // PENTING: Jangan cache request Auth Supabase!
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /auth/, /supabase/], 

        runtimeCaching: [
          {
            // Cache data Supabase REST API
            urlPattern: ({ url }) => url.hostname.includes('supabase.co') && url.pathname.includes('/rest/v1/'),
            handler: 'NetworkFirst', // Selalu coba internet dulu agar data tidak usang
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 Hari saja cukup
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache Gambar Supabase
            urlPattern: ({ url }) => url.hostname.includes('supabase.co') && url.pathname.includes('/storage/v1/object/public/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 Hari
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },

      devOptions: {
        enabled: true, // Ubah ke true untuk debug di localhost
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
});