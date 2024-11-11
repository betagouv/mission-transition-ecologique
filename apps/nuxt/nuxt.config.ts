import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { defineNuxtConfig } from 'nuxt/config'
import { NuxtSecurityConfig } from './nuxt.security.config'
import { NuxtSentryConfig } from './nuxt.sentry.config'
import { ChangeFreq, Priority } from './src/types/sitemapType'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-09',
  workspaceDir: '../../',
  srcDir: 'src',

  telemetry: false,
  sourcemap: true,

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
    telemetry: false,
  },

  devServer: {
    host: 'localhost',
    port: 4242
  },

  typescript: {
    typeCheck: true,
    tsConfig: {
      extends: '../tsconfig.app.json', // Nuxt copies this string as-is to the `./.nuxt/tsconfig.json`, therefore it needs to be relative to that directory
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
    plugins: [nxViteTsPaths()],
  },

  modules: ['@pinia/nuxt', 'vue-dsfr-nuxt-module', '@sentry/nuxt/module', 'nuxt-security', "@nuxtjs/sitemap"],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  experimental: {
    renderJsonPayloads: false,
    inlineRouteRules: true,
  },

  security: {
    headers: NuxtSecurityConfig.getHeaderConfig(),
  },

  sentry: NuxtSentryConfig.getConfig(),

  sitemap: {
    cacheMaxAgeSeconds: 2678400, // 31 days
    debug: true,
    credits:false,
    autoLastmod: true,
    defaults: {
      changefreq: ChangeFreq.Monthly,
      priority: Priority.Low
    },
    sources: [
      '/api/__sitemap__/programs',
      '/api/__sitemap__/projects',
    ]
  },
})
