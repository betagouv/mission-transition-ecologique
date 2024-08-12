import type { ImportMetaEnv } from './env'
import { ConfigCommon, Environment } from '@tee/common'

export default class Config extends ConfigCommon {
  static metaEnv: ImportMetaEnv = import.meta.env as ImportMetaEnv
  protected static override _sentryDsn = this.metaEnv.VITE_SENTRY_DSN
  protected static override _sentryEnvironment = this.metaEnv.VITE_SENTRY_ENVIRONMENT as Environment

  static get isProduction() {
    return this.metaEnv.PROD
  }

  static get isDevelopment() {
    return this.metaEnv.DEV
  }

  static get mode() {
    return this.metaEnv.MODE
  }

  static get deployUrl() {
    return this.metaEnv.VITE_DEPLOY_URL
  }

  static get backendUrl() {
    return this.metaEnv.VITE_TEE_BACKEND_URL || 'https://tee-backend.osc-fr1.scalingo.io'
  }

  static get isDebugSwitch() {
    return this.metaEnv.VITE_NO_DEBUG_SWITCH === 'false'
  }

  static get contactEmail() {
    return this.metaEnv.VITE_CONTACT_EMAIL ?? 'contact@mission-transition-ecologique.beta.gouv.fr'
  }

  static get baseUrl() {
    return this.metaEnv.BASE_URL
  }

  static get publicPath() {
    return this.isDevelopment ? this.baseUrl : `${this.deployUrl}/`
  }

  static get posthogApiKey() {
    return this.metaEnv.POSTHOG_API_KEY as string
  }
}
