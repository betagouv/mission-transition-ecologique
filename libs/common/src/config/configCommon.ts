import { Environment } from './types'

export default abstract class ConfigCommon {
  protected static _serverEnvironments: Environment[] = [Environment.Prod, Environment.Preprod, Environment.Dev]
  protected static _serverEnvironment: Environment = (process.env['SERVER_ENV'] as Environment) || Environment.Dev

  protected static _sentryDsn: string | undefined

  public static get NODE_ENV(): string {
    return this.getEnvValue('NODE_ENV', 'development')
  }

  public static isProduction(environment: Environment | undefined = undefined): boolean {
    if (environment) {
      return environment === Environment.Prod
    }

    return this.SERVER_ENVIRONMENT === Environment.Prod
  }

  public static get IS_REVIEW_APP(): boolean {
    return this.getEnvValue('IS_REVIEW_APP', 'false') === 'true'
  }

  public static isScalingo(): boolean {
    return this.getEnvValue('STACK', ' ').includes('scalingo')
  }

  public static get SENTRY_DSN(): string | undefined {
    if (!this._sentryDsn) {
      return undefined
    }

    return this._sentryDsn
  }

  public static get SERVER_ENVIRONMENT(): Environment {
    if (!this.isValidServerEnvironment(this._serverEnvironment)) {
      throw new Error('SERVER_ENVIRONMENT is not valid')
    }

    return this._serverEnvironment
  }

  protected static isValidServerEnvironment(sentryEnvironment: Environment): boolean {
    return this._serverEnvironments.includes(sentryEnvironment)
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
}
