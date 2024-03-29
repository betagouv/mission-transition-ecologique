import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { type BuildOptions, defineConfig } from 'vite'
import type { ServerOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dsnFromString } from '@sentry/utils'
import * as dotenv from 'dotenv'
import SEOPlugin from './plugin/SEO/index'

dotenv.config()

console.log('Starting ...')
console.log('vite.config ...')

const mode = process.env.NODE_ENV ?? 'development'
const isProd = mode === 'production'

type LibType = 'main' | 'widget'
const LIB: LibType = (process.env.LIB as LibType) ?? 'main'
const libConfig: Record<LibType, BuildOptions> = {
  main: {
    emptyOutDir: false
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

const plugins = async () => {
  const basePlugins = [vue(), SEOPlugin()]
  if (isProd) {
    return basePlugins
  } else {
    const eslintPlugin = await import('vite-plugin-eslint')
    return [...basePlugins, eslintPlugin.default()]
  }
}

const currentConfig = libConfig[LIB]

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
  server: viteServer,
  plugins: [plugins()],
  build: currentConfig,
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      // cf: https://stackoverflow.com/questions/72660014/how-to-make-vue-and-vite-work-with-web-components
      '~@gouvfr': fileURLToPath(new URL('../../node_modules/@gouvfr', import.meta.url)),
      '~@gouvminint': fileURLToPath(new URL('../../node_modules/@gouvminint', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@public': fileURLToPath(new URL('./public', import.meta.url)),
      '@icons': fileURLToPath(new URL('../../node_modules/oh-vue-icons', import.meta.url))
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
      "script-src 'self' ;" +
      "script-src-elem 'self' 'unsafe-inline' https://stats.beta.gouv.fr  https://embed.typeform.com;" +
      "style-src 'self' 'unsafe-inline' https://embed.typeform.com;" +
      "font-src 'self';" +
      "img-src 'self' data:;" +
      "object-src 'self';" +
      `connect-src 'self' https://place-des-entreprises.beta.gouv.fr https://stats.beta.gouv.fr ${sentryData?.domain ? sentryData.domain : ''} https://embed.typeform.com https://api.typeform.com;` +
      "worker-src 'self' blob:;" +
      "frame-src 'self' https://place-des-entreprises.beta.gouv.fr https://form.typeform.com;" +
      "frame-ancestors 'self' https://place-des-entreprises.beta.gouv.fr;",
    'X-Frame-Options': 'ALLOW-FROM https://place-des-entreprises.beta.gouv.fr',
    'X-Content-Type-Options': 'nosniff'
  }

  if (sentryData) {
    // Disabled because of sent too much report error data to sentry. Need to have rate limiter to have sample.
    // Check https://sentry.incubateur.net/settings/betagouv/projects/tee-frontend-vue/security-headers/
    // headers['Content-Security-Policy'] += `report-uri ${sentryData.url};`
    // headers['Public-Key-Pins'] = `default-src 'self' ${sentryData.domain};` + `report-uri ${sentryData.url};`
    headers['Expect-CT'] = `default-src 'self' ${sentryData.domain};` + `report-uri ${sentryData.url};`
  }

  return headers
}
