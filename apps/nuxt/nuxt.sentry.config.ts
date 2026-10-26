import { ModuleOptions as SentryOptions } from '@sentry/nuxt/build/types/module'
import { dsnFromString } from '@sentry/core'
import Config from './src/config'

export class NuxtSentryConfig {
  static getConfig() {
    const options: SentryOptions = {}
    if (Config.isProduction()) {
      // Source maps are uploaded to the Sentry instance of the DSN (self-hosted), not to sentry.io
      const sentryData = this.getSentryData()
      const token = process.env.SENTRY_AUTH_TOKEN

      if (token) {
        return {
          ...options,
          telemetry: false,
          authToken: token,
          sentryUrl: sentryData?.domain,
          org: 'betagouv',
          unstable_sentryBundlerPluginOptions: {
            // The module uses the same options for client (Vite) and server (Nitro) bundles:
            // server errors are reported to tee-backend-express, client errors to tee-frontend-vue
            project: ['tee-frontend-vue', 'tee-backend-express'],
            errorHandler: (error: Error) => {
              console.warn(error)
            }
          }
        }
      }

      return options
    }
  }

  static getSentryData(): { domain: string; url: string } | undefined {
    const dsnComponents = dsnFromString(Config.SENTRY_DSN ?? '')
    if (dsnComponents === undefined) {
      return undefined
    }

    const { host, path, projectId, publicKey } = dsnComponents
    return {
      domain: `https://${host}${path}`,
      url: `https://${host}${path}/api/${projectId}/security/?sentry_key=${publicKey}`
    }
  }
}
