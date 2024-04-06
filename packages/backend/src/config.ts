import ConfigCommon from '../../common/src/config/configCommon'
import { Environment } from '@tee/common/src/config/types'

export default class Config extends ConfigCommon {
  protected static override _sentryDsn = process.env['SENTRY_DSN']
  protected static override _sentryEnvironment = process.env['SENTRY_ENVIRONMENT'] as Environment

  public static get BPI_FRANCE_CLIENT_ID(): string {
    if (!process.env['BPI_FRANCE_CLIENT_ID']) {
      throw new Error('BPI_FRANCE_CLIENT_ID is not defined')
    }

    return process.env['BPI_FRANCE_CLIENT_ID']
  }

  public static get BPI_FRANCE_CLIENT_SECRET(): string {
    if (!process.env['BPI_FRANCE_CLIENT_SECRET']) {
      throw new Error('BPI_FRANCE_CLIENT_SECRET is not defined')
    }

    return process.env['BPI_FRANCE_CLIENT_SECRET']
  }

  public static get BREVO_DEAL_PIPELINE(): string | undefined {
    if (!process.env['BREVO_DEAL_PIPELINE']) {
      return undefined
    }
    return process.env['BREVO_DEAL_PIPELINE']
  }
}
