// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

// Detectar modo desarrollo por el comando ejecutado
const isDev = process.argv.includes('dev')

export default defineNuxtConfig({
  ssr: false,

  // PWA solo en build/generate — en dev causa error #app-manifest
  modules: [
    '@pinia/nuxt',
    ...(isDev ? [] : ['@vite-pwa/nuxt']),
  ],

  ...(isDev
    ? {}
    : {
        // Configuración PWA — solo cuando el módulo está cargado
        pwa: {
          strategies: 'generateSW',
          registerType: 'autoUpdate',
          manifest: {
            name: 'Trivia UPN',
            short_name: 'TriviaUPN',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
          },
          client: {
            installPrompt: true,
          },
          // PWA no funciona en dev — se activa solo en build/generate
          devOptions: {
            enabled: false,
          },
        },
      }),

  devtools: { enabled: true },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2025-05-15',
})
