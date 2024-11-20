import { NuxtConfigScriptRegistry } from '@nuxt/scripts/dist/runtime/types'
// eslint-disable-next-line @nx/enforce-module-boundaries
import ConfigCommon from '../../libs/common/src/config/configCommon'

export class NuxtScriptsConfig {
  static getRegistry(): NuxtConfigScriptRegistry | undefined {
    if (ConfigCommon.isProduction()) {
      return {
        matomoAnalytics: true
      }
    }

    return undefined
  }
}
