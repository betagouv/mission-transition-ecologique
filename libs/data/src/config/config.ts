import { ConfigCommon } from '@tee/common'
import dotenv from 'dotenv'

export default class Config extends ConfigCommon {
  public static loadDotEnv() {
    dotenv.config()
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
}
