import { dsnFromString } from '@sentry/utils'
import { ModuleOptions as SentryOptions } from '@sentry/nuxt/build/types/module'
import Config from './src/config'

export class NuxtSentryConfig {
  static getConfig() {
    const options: SentryOptions = {}
    if (Config.isProduction()) {
      // const sentryData = this.getSentryData()
      const token = process.env.SENTRY_AUTH_TOKEN

      if (token) {
        return {
          ...options,
          sourceMapsUploadOptions: {
            telemetry: false,
            authToken: token,
            org: 'betagouv',
            project: 'tee-frontend-vue'
          }
        }
      }

      return options
    }
  }

  static getSentryData(): { domain: string; url: string } | undefined {
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
}
