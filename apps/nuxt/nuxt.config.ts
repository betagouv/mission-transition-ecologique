import { defineOrganization } from 'nuxt-schema-org/schema'
import Config from './src/config'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { DefineNuxtConfig, defineNuxtConfig } from 'nuxt/config'
import { suppressWarningsPlugin } from './vite.logger.plugin'
import { NuxtScriptsConfig } from './nuxt.scripts.config'
import { NuxtSecurityConfig } from './nuxt.security.config'
import { NuxtSentryConfig } from './nuxt.sentry.config'
import { ChangeFreq, Priority } from './src/types/sitemapType'
import { MetaSeo } from './src/tools/metaSeo'
import { Identity } from './src/tools/identity'

/**
 * Remove prerender and swr for CI and test data.
 *
 * Because it's missing images on projects or programs from data test
 * it can cause issues with the build
 */
const hasPrerenderOrSwr = !process.env.CI && !Config.isTestData
const maxAge31Days = 2678400 // 31 days in seconds
const maxAge7Days = 604800 // 7 days in seconds

// https://nuxt.com/docs/api/configuration/nuxt-config
export default <DefineNuxtConfig>defineNuxtConfig({
  app: {
    rootId: 'tee',
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    }
  },
  routeRules: {
    '/_nuxt/**': {
      headers: {
        'cache-control': `public, max-age=${maxAge31Days}, s-maxage=${maxAge31Days}`
      }
    },
    '/images/**': {
      headers: {
        'cache-control': `public, max-age=${maxAge31Days}, s-maxage=${maxAge31Days}`
      }
    },
    '/': { prerender: true },
    '/aides-entreprise': { prerender: hasPrerenderOrSwr },
    '/aides-entreprise/**': { swr: hasPrerenderOrSwr },
    '/projets-entreprise': { prerender: hasPrerenderOrSwr },
    '/projets-entreprise/**': { swr: hasPrerenderOrSwr },
    '/accessibilite': { prerender: true },
    // '/mentions-legales': { prerender: true },
    // '/donnees-personnelles': { prerender: true },
    '/stats': { swr: 86400 }, // cached for 1 day (86400 seconds)
    '/budget': { prerender: true },
    '/ajouter-une-aide-entreprises': { prerender: true },
    '/iframe/**': {
      swr: true,
      security: {
        headers: NuxtSecurityConfig.getIframePageHeadersConfig()
      }
    },
    '/iframe': {
      swr: true,
      security: {
        headers: NuxtSecurityConfig.getIframePageHeadersConfig()
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
      enabled: true
    },
    telemetry: false
  },
  devServer: {
    host: 'localhost',
    port: 4242
  },
  typescript: {
    typeCheck: false,
    tsConfig: {
      extends: '../tsconfig.app.json' // Nuxt copies this string as-is to the `./.nuxt/tsconfig.json`, therefore it needs to be relative to that directory
    }
  },
  imports: {
    autoImport: true
  },
  css: [
    // '@gouvfr/dsfr/dist/dsfr.min.css', // Le CSS minimal du DSFR
    // '@gouvfr/dsfr/dist/utility/icons/icons.min.css', // Styles de tous les composants du DSFR
    '@gouvminint/vue-dsfr/styles', // Styles des composants VueDsfr
    '~/assets/custom.css',
    '~/assets/main.scss'
  ],
  vite: {
    plugins: [nxViteTsPaths(), suppressWarningsPlugin()],
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
      pathPrefix: false
    }
  ],
  nitro: {
    experimental: {
      openAPI: true
    },
    devStorage: {
      cache: {
        driver: 'null'
      }
    }
  },
  features: {
    inlineStyles: false,
    devLogs: true
  },
  experimental: {
    renderJsonPayloads: false,
    inlineRouteRules: true,
    headNext: true
    // sharedPrerenderData: true, // interssant pour eviter de refaire plusieurs fois la meme requete (https://nuxt.com/docs/api/nuxt-config#sharedprerenderdata)
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-security',
    'vue-dsfr-nuxt-module',
    '@sentry/nuxt/module',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/scripts',
    '@nuxt/image',
    'nuxt-schema-org'
  ],
  // Modules who need to have a look:
  // - nuxt-purgecss
  // - @nuxtjs/critters
  security: {
    ssg: {
      hashScripts: true
    },
    headers: NuxtSecurityConfig.getHeadersConfig(),
    rateLimiter: NuxtSecurityConfig.getRateLimiterConfig(),
    xssValidator: NuxtSecurityConfig.getXssValidatorConfig()
  },
  sentry: NuxtSentryConfig.getConfig(),
  sitemap: {
    cacheMaxAgeSeconds: 2678400, // 31 days
    credits: false,
    autoLastmod: true,
    experimentalWarmUp: true,
    defaults: {
      changefreq: ChangeFreq.Monthly,
      priority: Priority.Low
    },
    sources: ['/api/__sitemap__/programs', '/api/__sitemap__/projects']
  },
  robots: {
    disallow: ['/ajouter-une-aide-entreprises', '/iframe/**', '/iframe', '/demo/**'],
    credits: false
  },
  site: {
    name: MetaSeo.title(),
    description: Identity.description
  },
  schemaOrg: {
    defaults: false
  },
  scripts: {
    registry: NuxtScriptsConfig.getRegistry()
  },
  image: {
    format: ['webp'],
    screen: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1248
    },
    densities: [1],
    ipx: {
      maxAge: maxAge7Days
    }
  },
  runtimeConfig: {
    public: {
      environment: Config.SERVER_ENVIRONMENT,
      sentry: {
        dsn: Config.SENTRY_DSN
      },
      siteUrl: undefined, // Defined on environment variables
      posthog: {
        apiKey: Config.posthogApiKey
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
