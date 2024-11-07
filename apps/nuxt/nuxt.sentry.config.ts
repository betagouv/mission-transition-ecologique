import { dsnFromString } from '@sentry/utils'
import { Options as SentryOptions } from '@sentry/bundler-plugin-core'
import ConfigCommon from '../../libs/common/src/config/configCommon'

export class NuxtSentryConfig {
  static getConfig(): SentryOptions {
    if (ConfigCommon.isProduction()) {
      const sentryData = this.getSentryData()
      const token = process.env.SENTRY_AUTH_TOKEN

      if (token) {
        return {
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'betagouv',
          project: 'tee-frontend-vue',
          url: sentryData?.domain,
          sourcemaps: {
            filesToDeleteAfterUpload: ['../../dist/apps/web/**/*.js.map']
          }
        }
      }

      return {}
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
