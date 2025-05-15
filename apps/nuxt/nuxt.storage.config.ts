import { NitroConfig } from 'nitropack/config'
import Config from './src/config'

export class NuxtStorageConfig {
  static get(): NitroConfig['storage'] {
    if (!Config.IS_REVIEW_APP && Config.redisUrl) {
      return {
        cache: {
          driver: 'redis',
          url: Config.redisUrl
        }
      }
    }

    return undefined
  }
}
