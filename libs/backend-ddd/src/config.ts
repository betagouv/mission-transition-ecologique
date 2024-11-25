import { ConfigCommon, Environment } from '@tee/common'

export default class Config extends ConfigCommon {
  protected static override _sentryDsn = process.env['SENTRY_DSN']
  protected static override _sentryEnvironment = process.env['SENTRY_ENVIRONMENT'] as Environment

  public static get BPI_FRANCE_CLIENT_ID(): string {
    return this.getEnvValue('BPI_FRANCE_CLIENT_ID')
  }

  public static get BPI_FRANCE_CLIENT_SECRET(): string {
    return this.getEnvValue('BPI_FRANCE_CLIENT_SECRET')
  }

  public static get BREVO_API_TOKEN(): string {
    return this.getEnvValue('BREVO_API_TOKEN')
  }

  public static get BREVO_SANDBOX(): boolean {
    return this.getEnvValue('BREVO_SANDBOX', 'false') === 'true'
  }

  public static get BREVO_SENDER_ID(): number {
    return parseInt(this.getEnvValue('BREVO_SENDER_ID'))
  }

  public static get PDE_API_TOKEN(): string {
    return this.getEnvValue('PDE_API_TOKEN')
  }

  public static get PDE_API_BASEURL(): string {
    return this.getEnvValue('PDE_API_BASEURL')
  }

  public static get DEBUG(): boolean {
    return this.getEnvValue('DEBUG', 'false') === 'true'
  }

  public static get BREVO_DEAL_PIPELINE(): string | undefined {
    try {
      return this.getEnvValue('BREVO_DEAL_PIPELINE')
    } catch (error) {
      return undefined
    }
  }
  public static get THIRD_API_ENABLED(): boolean {
    return this.getEnvValue('THIRD_API_ENABLED', 'true') !== 'false'
  }

  public static get BREVO_API_ENABLED(): boolean {
    return this.THIRD_API_ENABLED && this.getEnvValue('BREVO_API_ENABLED', 'true') !== 'true'
  }

  public static get PDE_API_ENABLED(): boolean {
    return this.THIRD_API_ENABLED && this.getEnvValue('PDE_API_ENABLED', 'true') !== 'true'
  }

  public static get BPI_API_ENABLED(): boolean {
    return this.THIRD_API_ENABLED && this.getEnvValue('BPI_API_ENABLED', 'true') !== 'true'
  }
}
