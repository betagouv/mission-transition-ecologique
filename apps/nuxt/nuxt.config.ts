import Config from './src/config'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { DefineNuxtConfig, defineNuxtConfig } from 'nuxt/config'
import { NuxtScriptsConfig } from './nuxt.scripts.config'
import { NuxtSecurityConfig } from './nuxt.security.config'
import { NuxtSentryConfig } from './nuxt.sentry.config'
import { ChangeFreq, Priority } from './src/types/sitemapType'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default<DefineNuxtConfig> defineNuxtConfig({
  app: {
    rootId: 'tee',
    head: {
      htmlAttrs: {
        lang: 'fr'
      }
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/accessibilite': { prerender: true },
    // '/mentions-legales': { prerender: true },
    // '/donnees-personnelles': { prerender: true },
    '/stats': { swr: 86400 }, // cached for 1 day (86400 seconds)
    '/budget': { prerender: true },
    '/ajouter-une-aide-entreprises': { prerender: true },
    '/iframe/projet/**': {
      swr: true,
      security: {
        headers: NuxtSecurityConfig.getIframePageHeadersConfig(),
      }
    }
  },
  compatibilityDate: '2024-10-09',
  workspaceDir: '../../',
  srcDir: 'src',
  telemetry: false,
  sourcemap: { client: 'hidden', server: true },
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
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin']
        }
      }
    }
  },
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
    devStorage: {
      cache: {
        driver: 'null'
      }
    }
  },
  features: {
    inlineStyles: false,
    devLogs: true,
  },
  experimental: {
    renderJsonPayloads: false,
    inlineRouteRules: true,
    // sharedPrerenderData: true, // interssant pour eviter de refaire plusieurs fois la meme requete (https://nuxt.com/docs/api/nuxt-config#sharedprerenderdata)
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-security',
    'vue-dsfr-nuxt-module',
    '@sentry/nuxt/module',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/scripts'
  ],
  // Modules who need to have a look:
  // - nuxt-purgecss
  // - @nuxtjs/critters
  security: {
    ssg: {
      hashScripts: true
    },
    headers: NuxtSecurityConfig.getHeadersConfig(),
    rateLimiter: NuxtSecurityConfig.getRateLimiterConfig()
  },
  sentry: NuxtSentryConfig.getConfig(),
  sitemap: {
    cacheMaxAgeSeconds: 2678400, // 31 days
    credits:false,
    autoLastmod: true,
    experimentalWarmUp: true,
    defaults: {
      changefreq: ChangeFreq.Monthly,
      priority: Priority.Low
    },
    sources: [
      '/api/__sitemap__/programs',
      '/api/__sitemap__/projects',
    ]
  },
  robots: {
    disallow:[
      '/questionnaire/',
      '/ajouter-une-aide-entreprises',
      '/iframe/projet/'
    ],
    credits: false
  },
  scripts: {
    registry: NuxtScriptsConfig.getRegistry(),
  },
  runtimeConfig: {
    public: {
      environment: Config.SERVER_ENVIRONMENT,
      sentry: {
        dsn: Config.SENTRY_DSN,
      },
      posthog: {
        apiKey: Config.posthogApiKey,
      },
      scripts: {
        matomoAnalytics: {
          matomoUrl: '',
          siteId: '',
          trackPageView: true,
          enableLinkTracking: true,
          disableCookies: true
        }
      }
    }
  }
})
