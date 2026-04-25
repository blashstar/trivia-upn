// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

// Detectar modo desarrollo por el comando ejecutado
const isDev = process.argv.includes('dev')

export default defineNuxtConfig({
  ssr: false,

  pageTransition: { name: 'slide-fade', mode: 'out-in' },

  // Evita error de Vite "Failed to resolve import #app-manifest" en dev
  // (pre-análisis de import() aunque la rama sea muerta con ssr: false).
  // Ver: https://github.com/nuxt/nuxt/issues/33606
  experimental: {
    appManifest: false,
  },

  // Deshabilitar build del servidor en dev cuando ssr: false
  nitro: {
    prerender: {
      failOnError: false,
    },
  },

  devServer: {
    port: 3000,
  },

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

  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          // Inyecta variables y mixins en todos los bloques <style lang="stylus">
          imports: [
            resolve(__dirname, 'assets/css/_variables.styl'),
            resolve(__dirname, 'assets/css/_mixins.styl'),
          ],
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    },
  },

  compatibilityDate: '2025-05-15',
})
