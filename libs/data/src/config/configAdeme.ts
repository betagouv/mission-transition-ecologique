import { ConfigCommon } from '@tee/common'

export default class ConfigAdeme extends ConfigCommon {
  private static _baseUrl = 'https://ppd-x-ademe-externe-api.de-c1.eu1.cloudhub.io/api/v1'

  public static get CLIENT_ID(): string {
    return this.getEnvValue('ADEME_CLIENT_ID')
  }

  public static get CLIENT_SECRET(): string {
    return this.getEnvValue('ADEME_CLIENT_SECRET')
  }

  public static get BASE_URL(): string {
    return this.getEnvValue('ADEME_BASE_URL', this._baseUrl)
  }
}
