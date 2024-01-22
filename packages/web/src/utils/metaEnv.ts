import type { ImportMetaEnv } from '@/env'

export default class MetaEnv {
  static metaEnv: ImportMetaEnv = import.meta.env as ImportMetaEnv

  static get deployUrl() {
    if (this.metaEnv.APP && this.metaEnv.VITE_SERVER_ENV === 'preprod') {
      return `https://${this.metaEnv.APP}.osc-fr1.scalingo.io`
    }
    return this.metaEnv.VITE_DEPLOY_URL
  }
}
