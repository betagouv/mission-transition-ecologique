import type { ImportMetaEnv } from '@/env'

export default class MetaEnv {
  static metaEnv: ImportMetaEnv = import.meta.env as ImportMetaEnv
  private static _sentryEnvironment = ['prod', 'preprod']
  private static _sentryDefaultEnvironment = 'preprod'

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
    return this.metaEnv.VITE_CONTACT_EMAIL ?? 'france-transition@beta.gouv.fr'
  }

  static get hasMatomo() {
    return this.metaEnv.VITE_MATOMO_DEACTIVATE === 'false'
  }

  static get baseUrl() {
    return this.metaEnv.BASE_URL
  }

  static get publicPath() {
    return `${this.deployUrl}/${this.metaEnv.BASE_URL}`
  }

  static get matomoUrl() {
    return this.metaEnv.VITE_MATOMO_URL
  }

  static get matomoAppId() {
    return this.metaEnv.VITE_MATOMO_APP_ID
  }

  static get SENTRY_DSN(): string | undefined {
    if (!this.metaEnv['VITE_SENTRY_DSN']) {
      return undefined
    }

    return this.metaEnv['VITE_SENTRY_DSN']
  }

  static get SENTRY_ENVIRONMENT(): string {
    if (!this.metaEnv['VITE_SENTRY_ENVIRONMENT']) {
      this.metaEnv['VITE_SENTRY_ENVIRONMENT'] = this._sentryDefaultEnvironment
    }

    if (!this.isValidSentryEnvironment(this.metaEnv['VITE_SENTRY_ENVIRONMENT'])) {
      throw new Error('VITE_SENTRY_ENVIRONMENT is not valid')
    }

    return this.metaEnv['VITE_SENTRY_ENVIRONMENT']
  }

  private static isValidSentryEnvironment(sentryEnvironment: string): boolean {
    return this._sentryEnvironment.includes(sentryEnvironment)
  }
}
