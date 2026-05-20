import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'inline', // 🚀 Fuerza a inyectar el registro de instalación directamente
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
            purpose: 'any maskable'
          },
          {
            src: 'img/icono.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'img/icono2.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})
