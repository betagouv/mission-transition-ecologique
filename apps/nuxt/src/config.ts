// @ts-expect-error relative path to import configCommon because of nuxt.config.ts .
// eslint-disable-next-line @nx/enforce-module-boundaries
import ConfigCommon from '../../../libs/common/src/config/configCommon'
import { Environment } from '@tee/common'
// eslint-disable-next-line @nx/enforce-module-boundaries

export default class Config extends ConfigCommon {
  protected static override _sentryDsn = process.env['SENTRY_CLIENT_DSN']
  protected static override _serverEnvironment: Environment = (() => {
    if (typeof window === 'undefined') {
      // Server-side
      return (process.env['SERVER_ENV'] as Environment) || Environment.Dev
    } else {
      // Client-side
      return (import.meta.env.VITE_SERVER_ENV as Environment) || Environment.Dev
    }
  })()

  static get contactEmail() {
    return process.env['VITE_CONTACT_EMAIL'] ?? 'contact@mission-transition-ecologique.beta.gouv.fr'
  }

  public static hasMatomo() {
    return this.isProduction() || process.env['VITE_MATOMO_ENABLE'] === 'true'
  }

  static get baseUrl() {
    return process.env['BASE_URL']
  }

  static get posthogApiKey() {
    return process.env['POSTHOG_API_KEY'] || 'fake token'
  }

  static get isTestData() {
    return this.getEnvValue('VITE_DATA_TEST', 'false') === 'true'
  }
}
