import { Environment } from './types'

export default abstract class ConfigCommon {
  protected static _sentryEnvironments: Environment[] = [Environment.Prod, Environment.Preprod, Environment.Dev]
  protected static _sentryDefaultEnvironment = Environment.Dev

  protected static _sentryDsn: string | undefined
  protected static _sentryEnvironment: Environment | undefined

  protected static isValidSentryEnvironment(sentryEnvironment: Environment): boolean {
    return this._sentryEnvironments.includes(sentryEnvironment)
  }

  protected static getEnvValue(name: string, defaultValue: string | undefined = undefined): string {
    const value = process.env[name]

    if (!value) {
      if (defaultValue) {
        return defaultValue
      }

      throw new Error(`${name} is not defined`)
    }

    return value
  }

  public static get NODE_ENV(): string {
    return this.getEnvValue('NODE_ENV', 'development')
  }

  public static get SENTRY_DSN(): string | undefined {
    if (!this._sentryDsn) {
      return undefined
    }

    return this._sentryDsn
  }

  public static get SENTRY_ENVIRONMENT(): Environment {
    if (!this._sentryEnvironment) {
      this._sentryEnvironment = this._sentryDefaultEnvironment
    }

    if (!this.isValidSentryEnvironment(this._sentryEnvironment)) {
      throw new Error('SENTRY_ENVIRONMENT is not valid')
    }

    return this._sentryEnvironment
  }

  public static get IS_REVIEW_APP(): boolean {
    return this.getEnvValue('IS_REVIEW_APP', 'false') === 'true'
  }

  public static isScalingo(): boolean {
    return this.getEnvValue('STACK', ' ').includes('scalingo')
  }

  public static isProduction(): boolean {
    return this.NODE_ENV === 'production' && this.isScalingo() && !this.IS_REVIEW_APP
  }
}
