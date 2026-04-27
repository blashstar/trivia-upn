// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineNuxtConfig({
  ssr: false,

  app: {
    baseURL: '/',
  },

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

  modules: [
    '@pinia/nuxt',
  ],

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
