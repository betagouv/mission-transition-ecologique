import { ConfigCommon } from '@tee/common'
import dotenv from 'dotenv'

export default class Config extends ConfigCommon {
  public static loadDotEnv() {
    dotenv.config()
  }
}
