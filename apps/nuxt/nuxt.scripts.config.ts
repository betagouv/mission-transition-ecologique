import { NuxtConfigScriptRegistry } from '@nuxt/scripts/dist/runtime/types'
import Config from './src/config'

export class NuxtScriptsConfig {
  static getRegistry(): NuxtConfigScriptRegistry | undefined {
    if (Config.hasMatomo()) {
      return {
        matomoAnalytics: true
      }
    }

    return undefined
  }
}
