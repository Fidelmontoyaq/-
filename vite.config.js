import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Michi Político',
        short_name: 'MichiPol',
        description: 'Juego de Michi personalizado con temática política',
        theme_color: '#FF6600',
        background_color: '#fafafa',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'img/icono.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable' // 🤖 Fuerza a Android a encuadrar el ícono perfectamente
          },
          {
            src: 'img/icono.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'img/icono2.png', // 🍏 Ícono exclusivo para iPhone
            sizes: '180x180',       // Tamaño estándar que exige Apple para los accesos directos
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})