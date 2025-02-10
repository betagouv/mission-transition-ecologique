import { ConfigCommon } from '@tee/common'

export default class Config extends ConfigCommon {
  protected static override _sentryDsn = process.env['SENTRY_SERVER_DSN']

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

  public static get METABASE_SECRET_KEY(): string {
    return this.getEnvValue('METABASE_SECRET_KEY')
  }

  public static get METABASE_SITE_URL(): string {
    return this.getEnvValue('METABASE_SITE_URL')
  }

  public static get BREVO_DEAL_PIPELINE(): string | undefined {
    try {
      return this.getEnvValue('BREVO_DEAL_PIPELINE')
    } catch (error) {
      return undefined
    }
  }
  public static get THIRD_PARTY_API_ENABLED(): boolean {
    return this.getEnvValue('THIRD_PARTY_API_ENABLED', 'true') !== 'false'
  }

  public static get BREVO_API_ENABLED(): boolean {
    return this.THIRD_PARTY_API_ENABLED && this.getEnvValue('BREVO_API_ENABLED', 'true') !== 'false'
  }

  public static get PDE_API_ENABLED(): boolean {
    return this.THIRD_PARTY_API_ENABLED && this.getEnvValue('PDE_API_ENABLED', 'true') !== 'false'
  }
}
