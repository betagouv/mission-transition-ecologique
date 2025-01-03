/// <reference types='vitest' />
import { vueDsfrAutoimportPreset, vueDsfrComponentResolver } from '@gouvminint/vue-dsfr'
import { BuildOptions, defineConfig, Plugin, ServerOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { dsnFromString } from '@sentry/utils'
import { sentryVitePlugin } from "@sentry/vite-plugin";
import * as dotenv from 'dotenv'
import { unheadVueComposablesImports } from '@unhead/vue'
import ConfigCommon from '../../libs/common/src/config/configCommon'

dotenv.config()

console.log('==== Vite Starting ... ====')
console.log('- vite.config ...')
const isProd = ConfigCommon.NODE_ENV === 'production'

type LibType = 'main' | 'widget'
const LIB: LibType = (process.env.LIB as LibType) ?? 'main'
const libBuildConfig: Record<LibType, BuildOptions> = {
  main: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    sourcemap: true
  },
  widget: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'widget.html')
    },
    lib: {
      name: 'gov-aid-tree-app',
      entry: 'widget/widget.ce.ts',
      fileName: 'widget'
    }
  }
}
const currentBuildConfig = libBuildConfig[LIB]

const plugins = async () => {
  const plugins = [
    vue(),
    nxViteTsPaths(),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: ['vue', 'vue-router', vueDsfrAutoimportPreset, unheadVueComposablesImports],
      vueTemplate: true,
      dts: './src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }) as Plugin,
    Components({
      extensions: ['vue'],
      dirs: ['src/components'],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: './src/components.d.ts',
      resolvers: [vueDsfrComponentResolver]
    }) as Plugin,

  ]
  if (ConfigCommon.isProduction()) {
    console.log('- Add sentry vite plugin for sourcemaps upload')
    const sentryData = getSentryData()
    const token = process.env.SENTRY_AUTH_TOKEN

    if (token) {
      plugins.push(sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "betagouv",
        project: "tee-frontend-vue",
        url: sentryData?.domain,
        sourcemaps: {
          filesToDeleteAfterUpload: [
            "../../dist/apps/web/**/*.js.map",
          ]
        }
      }))
    }
  }

  return plugins
}

const viteServer: ServerOptions = {
  host: '0.0.0.0',
  port: 4242,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      secure: false
    }
  },
  headers: buildHeaders()
}

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/web',

  server: viteServer,

  plugins: [plugins()],

  build: currentBuildConfig,

  define: {
    'process.env': process.env
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  test: {
    watch: false,
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest/apps/web'
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/web',
      provider: 'v8'
    }
  }
})

function getSentryData(): { domain: string; url: string } | undefined {
  const dsnComponents = dsnFromString(process.env.VITE_SENTRY_DSN ?? '')
  if (dsnComponents === undefined) {
    return undefined
  }

  const { host, path, projectId } = dsnComponents
  return {
    domain: `https://${host}${path}`,
    url: `https://${host}${path}/api/${projectId}/security/?sentry_key=${dsnComponents.publicKey}`
  }
}

function buildHeaders() {
  const sentryData = getSentryData()
  const headers: Record<string, string> = {
    'Content-Security-Policy':
      "default-src 'none';" +
      "base-uri 'self';" +
      "form-action 'self';" +
      "script-src-elem 'self' 'unsafe-inline' https://stats.beta.gouv.fr https://eu.i.posthog.com https://eu-assets.i.posthog.com https://embed.typeform.com;" +
      "style-src 'self' 'unsafe-inline' https://embed.typeform.com;" +
      "font-src 'self';" +
      "img-src 'self' data:;" +
      "object-src 'self';" +
      `connect-src 'self' https://conseillers-entreprises.service-public.fr https://stats.beta.gouv.fr ${
        sentryData?.domain ? sentryData.domain : ''
      } https://embed.typeform.com https://eu.i.posthog.com https://api.typeform.com;` +
      "worker-src 'self' blob:;" +
      "frame-src 'self' https://form.typeform.com;" +
      "frame-ancestors 'self';",

    'X-Content-Type-Options': 'nosniff'
  }

  if (sentryData) {
    // Disabled because of sent too much report error data to sentry. Need to have rate limiter to have sample.
    // Check https://sentry.incubateur.net/settings/betagouv/projects/tee-frontend-vue/security-headers/
    // headers['Content-Security-Policy'] += `report-uri ${sentryData.url};`
    // headers['Public-Key-Pins'] = `default-src 'self' ${sentryData.domain};` + `report-uri ${sentryData.url};`
    headers['Expect-CT'] = `default-src 'self' ${sentryData.domain};` + `report-uri ${sentryData.url};`
  }

  if (!isProd) {
    headers['Content-Security-Policy'] = "script-src 'self' 'unsafe-eval'; " + headers['Content-Security-Policy']
  } else {
    headers['Content-Security-Policy'] = "script-src 'self'; " + headers['Content-Security-Policy']
  }

  return headers
}
