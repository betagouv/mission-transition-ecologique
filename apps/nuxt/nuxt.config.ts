import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: 'src',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  devServer: {
    host: 'localhost',
    port: 4242
  },

  typescript: {
    typeCheck: true,
    tsConfig: {
      extends: '../tsconfig.app.json' // Nuxt copies this string as-is to the `./.nuxt/tsconfig.json`, therefore it needs to be relative to that directory
    }
  },

  imports: {
    autoImport: true
  },

  css: [
    '@gouvfr/dsfr/dist/dsfr.min.css',                // Le CSS minimal du DSFR
    '@gouvfr/dsfr/dist/utility/icons/icons.min.css', // Styles de tous les composants du DSFR
    '@gouvminint/vue-dsfr/styles',                   // Styles des composants VueDsfr
    '~/assets/custom.css',
    '~/assets/main.scss',
  ],
  vite: {
    plugins: [nxViteTsPaths()]
  },

  modules: ['@pinia/nuxt', 'vue-dsfr-nuxt-module'],
  compatibilityDate: '2024-10-09',
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  experimental: {
    renderJsonPayloads: false,
  },
  nitro: {
    experimental: {
      openAPI: true,
    }
  }
})
