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
        
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        // --- TAMBAHKAN KODE INI ---
        runtimeCaching: [
          {
            // 1. Caching untuk Data API Supabase (REST API)
            // Pola ini mencocokkan request ke domain supabase yang mengandung '/rest/v1/'
            urlPattern: ({ url }) => url.hostname.includes('supabase.co') && url.pathname.includes('/rest/v1/'),
            
            // Strategi: NetworkFirst
            // Artinya: Coba ambil data terbaru dari internet dulu. 
            // Jika OFFLINE atau gagal, baru ambil data lama dari cache.
            handler: 'NetworkFirst', 
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100, // Maksimal simpan 100 request
                maxAgeSeconds: 60 * 60 * 24 * 7 // Hapus cache setelah 7 hari
              },
              cacheableResponse: {
                statuses: [0, 200] // Hanya cache jika respons sukses
              }
            }
          },
          {
            // 2. Caching untuk Gambar dari Supabase Storage
            // Pola ini mencocokkan request gambar ke storage Supabase
            urlPattern: ({ url }) => url.hostname.includes('supabase.co') && url.pathname.includes('/storage/v1/object/public/'),
            
            // Strategi: CacheFirst
            // Artinya: Cek cache dulu. Jika gambar ada, tampilkan instan (hemat kuota & cepat).
            // Jika tidak ada, baru download dari internet.
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-image-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Simpan gambar selama 30 hari
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
        // ---------------------------
      },

      devOptions: {
        enabled: true, // Ubah ke true agar PWA bisa dites di localhost (npm run dev)
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
});