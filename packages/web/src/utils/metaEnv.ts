import type { ImportMetaEnv } from '@/env'

export default class MetaEnv {
  static metaEnv: ImportMetaEnv = import.meta.env as ImportMetaEnv
  private static _sentryEnvironment = ['prod', 'preprod']
  private static _sentryDefaultEnvironment = 'preprod'

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
