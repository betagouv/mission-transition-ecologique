import { NitroConfig } from 'nitropack/config'
import Config from './src/config'

export class NuxtStorageConfig {
  static get(): NitroConfig['storage'] {
    console.log(
      'NuxtStorageConfig',
      Config.SERVER_ENVIRONMENT && !Config.IS_REVIEW_APP && Config.redisUrl,
      Config.SERVER_ENVIRONMENT,
      !Config.IS_REVIEW_APP,
      Config.redisUrl
    )
    if (Config.SERVER_ENVIRONMENT && !Config.IS_REVIEW_APP && Config.redisUrl) {
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
