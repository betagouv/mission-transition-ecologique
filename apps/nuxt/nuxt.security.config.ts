import { SecurityHeaders, RateLimiter, ContentSecurityPolicyValue, XssValidator } from 'nuxt-security'
import { NuxtSentryConfig } from './nuxt.sentry.config'
import Config from './src/config'

export class NuxtSecurityConfig {
  static _statsBetaGouvFrUrl = 'https://stats.beta.gouv.fr'
  static _baserowFormUrl = 'https://baserow.io'
  static _metabaseUrl = 'https://tee-metabase.osc-fr1.scalingo.io'
  static _posthogUrl = 'https://eu.i.posthog.com'
  static _posthogAssetsUrl = 'https://eu-assets.i.posthog.com'
  static _sentryData = NuxtSentryConfig.getSentryData()

  static getHeadersConfig(): SecurityHeaders {
    return {
      contentSecurityPolicy: {
        ...this._getDefaultContentSecurityPolicy(),
        'frame-ancestors': ["'self'"]
      },
      crossOriginEmbedderPolicy: false,
      xFrameOptions: false
      // Missing headers:
      // 'X-Frame-Options': 'ALLOW-FROM https://conseillers-entreprises.service-public.fr',
      // 'Expect-CT': `default-src 'self' ${this._sentryData?.domain ? this._sentryData.domain : ''}; report-uri ${this._sentryData?.url};`
    }
  }

  static getIframePageHeadersConfig(): SecurityHeaders {
    return {
      contentSecurityPolicy: {
        ...this._getDefaultContentSecurityPolicy(),
        'frame-ancestors': false
      }
    }
  }

  private static _getDefaultContentSecurityPolicy(): ContentSecurityPolicyValue {
    return {
      'form-action': ["'self'"],
      'script-src-elem': [
        "'self'",
        "'unsafe-inline'",
        "'nonce-{{nonce}}'",
        this._statsBetaGouvFrUrl,
        this._posthogUrl,
        this._posthogAssetsUrl,
        this._baserowFormUrl,
        this._metabaseUrl
      ],
      'script-src': ["'self'", "'nonce-{{nonce}}'", "'strict-dynamic'", Config.isProduction() ? '' : "'unsafe-eval'"],
      'worker-src': ["'self'", 'blob:'],
      'style-src': ["'self'", "'unsafe-inline'", this._baserowFormUrl, this._metabaseUrl],
      'font-src': ["'self'"],
      'object-src': ["'self'"],
      'img-src': ["'self'", 'data:'],
      'connect-src': [
        "'self'",
        this._statsBetaGouvFrUrl,
        this._baserowFormUrl,
        this._metabaseUrl,
        this._posthogUrl,
        this._posthogAssetsUrl,
        this._sentryData?.domain ? this._sentryData.domain : ''
      ],
      'base-uri': ["'self'"],
      'frame-src': ["'self'", this._baserowFormUrl, this._metabaseUrl],
      'manifest-src': ["'self'"],
      'default-src': ["'none'"]
    }
  }

  static getRateLimiterConfig(): RateLimiter | undefined | false {
    return Config.isProduction() ? undefined : false
  }

  static getXssValidatorConfig(): XssValidator | undefined | false {
    return {
      // data already escaped on brevo. So no worries to disable escapedHtml on our backend (for now).
      escapeHtml: false
    }
  }
}
