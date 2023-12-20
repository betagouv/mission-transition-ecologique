import type { ImportMetaEnv } from '@/env'

export default class MetaEnv {
  static metaEnv: ImportMetaEnv = import.meta.env as ImportMetaEnv
  static get isProduction() {
    return this.metaEnv.PROD
  }

  static get isDevelopment() {
    return this.metaEnv.DEV
  }

  static get mode() {
    return this.metaEnv.MODE
  }

  static get deployUrl() {
    return this.metaEnv.VITE_DEPLOY_URL
  }

  static get backendUrl() {
    return this.metaEnv.VITE_TEE_BACKEND_URL || 'https://tee-backend.osc-fr1.scalingo.io'
  }

  static get isDebugSwitch() {
    return this.metaEnv.VITE_NO_DEBUG_SWITCH === 'false' ?? false
  }

  static get contactEmail() {
    return this.metaEnv.VITE_CONTACT_EMAIL ?? 'france-transition@beta.gouv.fr'
  }

  static get hasMatomo() {
    return this.metaEnv.VITE_MATOMO_DEACTIVATE === 'false' ?? false
  }

  static get baseUrl() {
    return this.metaEnv.BASE_URL
  }

  static get publicPath() {
    return `${this.deployUrl}/${this.metaEnv.BASE_URL}`
  }

  static get matomoUrl() {
    return this.metaEnv.VITE_MATOMO_URL
  }

  static get matomoAppId() {
    return this.metaEnv.VITE_MATOMO_APP_ID
  }
}
