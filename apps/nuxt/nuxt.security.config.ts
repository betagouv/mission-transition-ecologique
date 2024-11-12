import { SecurityHeaders } from 'nuxt-security'
import { NuxtSentryConfig } from './nuxt.sentry.config'
// eslint-disable-next-line @nx/enforce-module-boundaries
import ConfigCommon from '../../libs/common/src/config/configCommon'

export class NuxtSecurityConfig {
  static _conseillersEntreprisesUrl = 'https://conseillers-entreprises.service-public.fr'
  static _statsBetaGouvFrUrl = 'https://stats.beta.gouv.fr'
  static _typeformUrl = 'https://embed.typeform.com'
  static _typeformApiUrl = 'https://api.typeform.com'
  static _typeformFormUrl = 'https://form.typeform.com'
  static _posthogUrl = 'https://eu.i.posthog.com'
  static _posthogAssetsUrl = 'https://eu-assets.i.posthog.com'
  static _sentryData = NuxtSentryConfig.getSentryData()

  static getHeaderConfig(): SecurityHeaders {
    return {
      contentSecurityPolicy: {
        'form-action': ["'self'"],
        'script-src-elem': [
          "'self'",
          "'unsafe-inline'",
          "'nonce-{{nonce}}'",
          "'strict-dynamic'",
          this._statsBetaGouvFrUrl,
          this._posthogUrl,
          this._posthogAssetsUrl,
          this._typeformUrl
        ],
        'script-src': ["'self'", "'nonce-{{nonce}}'", "'strict-dynamic'", ConfigCommon.isProduction() ? '' : "'unsafe-eval'"],
        'worker-src': ["'self'", 'blob:'],
        'style-src': ["'self'", "'unsafe-inline'", this._typeformUrl],
        'font-src': ["'self'"],
        'object-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'connect-src': [
          "'self'",
          this._conseillersEntreprisesUrl,
          this._statsBetaGouvFrUrl,
          this._typeformUrl,
          this._typeformApiUrl,
          this._posthogUrl,
          this._posthogAssetsUrl,
          this._sentryData?.domain ? this._sentryData.domain : ''
        ],
        'base-uri': ["'self'"],
        'frame-ancestors': ["'self'", this._conseillersEntreprisesUrl],
        'frame-src': ["'self'", this._conseillersEntreprisesUrl, this._typeformFormUrl],
        'default-src': ["'none'"]
      }
      // Missing headers:
      // 'X-Frame-Options': 'ALLOW-FROM https://conseillers-entreprises.service-public.fr',
      // 'Expect-CT': `default-src 'self' ${this._sentryData?.domain ? this._sentryData.domain : ''}; report-uri ${this._sentryData?.url};`
    }
  }
}
