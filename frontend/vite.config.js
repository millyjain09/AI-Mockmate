import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Background mein app update kar dega jab tum naya code push karogi
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], // Zaroori assets
      manifest: {
        name: 'AI MockMate',
        short_name: 'MockMate',
        description: 'Master your interviews with AI confidence.',
        theme_color: '#020202', // Tumhara black/dark theme
        background_color: '#020202',
        display: 'standalone', // URL bar hide karne ke liye (Native feel)
        icons: [
          {
            src: '/logo192.png', // Ye image public folder mein honi chahiye
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo512.png', // Ye image public folder mein honi chahiye
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Android ke modern icons ke liye perfect
          }
        ]
      }
    })
  ],
})