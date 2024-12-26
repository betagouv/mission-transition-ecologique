// @ts-expect-error relative path to import configCommon because of nuxt.config.ts .
// eslint-disable-next-line @nx/enforce-module-boundaries
import ConfigCommon from '../../../libs/common/src/config/configCommon'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Environment } from '../../../libs/common/src/config/types'

export default class Config extends ConfigCommon {
  protected static override _sentryDsn = process.env['CLIENT_SENTRY_DSN']
  protected static override _sentryEnvironment = process.env['SENTRY_ENVIRONMENT'] as Environment

  static get isDevelopment() {
    return process.env['NODE_DEV'] === 'development'
  }

  static get deployUrl() {
    return process.env['VITE_DEPLOY_URL']
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

  static get publicPath() {
    return this.isDevelopment ? this.baseUrl : `${this.deployUrl}/`
  }

  static get posthogApiKey() {
    return process.env['VITE_POSTHOG_API_KEY'] || 'fake token'
  }
  static get matomoUrl() {
    return process.env['VITE_MATOMO_URL']
  }

  static get matomoAppId() {
    return process.env['VITE_MATOMO_APP_ID']
  }

  static get isTestData() {
    return this.getEnvValue('VITE_DATA_TEST', 'false') === 'true'
  }
}
