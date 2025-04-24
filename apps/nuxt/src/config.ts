// @ts-expect-error relative path to import configCommon because of nuxt.config.ts .
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Environment } from '../../../libs/common/src/config/types'
// eslint-disable-next-line @nx/enforce-module-boundaries
import ConfigCommon from '../../../libs/common/src/config/configCommon'

export default class Config extends ConfigCommon {
  protected static override _sentryDsn = process.env['SENTRY_CLIENT_DSN']

  public static override get SERVER_ENVIRONMENT(): Environment {
    if (import.meta.client) {
      const config = useRuntimeConfig()
      this._serverEnvironment = config.public.environment as Environment
    }
    if (!this.isValidServerEnvironment(this._serverEnvironment)) {
      throw new Error('SERVER_ENVIRONMENT is not valid')
    }

    return this._serverEnvironment
  }

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
