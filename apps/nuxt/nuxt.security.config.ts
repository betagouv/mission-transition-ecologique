import { SecurityHeaders, RateLimiter } from 'nuxt-security'
import { NuxtSentryConfig } from './nuxt.sentry.config'
import Config from './src/config'

export class NuxtSecurityConfig {
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
        // 'script-src-elem': [
        //   "'self'",
        //   "'unsafe-inline'",
        //   "'nonce-{{nonce}}'",
        //   "'strict-dynamic'",
        //   this._statsBetaGouvFrUrl,
        //   this._posthogUrl,
        //   this._posthogAssetsUrl,
        //   this._typeformUrl
        // ],
        'script-src': ["'self'", "'nonce-{{nonce}}'", "'strict-dynamic'", Config.isProduction() ? '' : "'unsafe-eval'"],
        'worker-src': ["'self'", 'blob:'],
        'style-src': ["'self'", "'unsafe-inline'", this._typeformUrl],
        'font-src': ["'self'"],
        'object-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'connect-src': [
          "'self'",
          this._statsBetaGouvFrUrl,
          this._typeformUrl,
          this._typeformApiUrl,
          this._posthogUrl,
          this._posthogAssetsUrl,
          this._sentryData?.domain ? this._sentryData.domain : ''
        ],
        'base-uri': ["'self'"],
        'frame-ancestors': ["'self'"],
        'frame-src': ["'self'", this._typeformFormUrl],
        'default-src': ["'none'"]
      }
      // Missing headers:
      // 'X-Frame-Options': 'ALLOW-FROM https://conseillers-entreprises.service-public.fr',
      // 'Expect-CT': `default-src 'self' ${this._sentryData?.domain ? this._sentryData.domain : ''}; report-uri ${this._sentryData?.url};`
    }
  }

  static getRateLimiterConfig(): RateLimiter | undefined | false {
    return Config.isProduction() ? undefined : false
  }
}
