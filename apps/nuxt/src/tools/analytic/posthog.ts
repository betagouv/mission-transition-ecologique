import { CookieValue } from '@/types/cookies'

import posthog, { PostHog, PostHogConfig } from 'posthog-js'
import Config from '@/config'
import { RouteLocationNormalized } from 'vue-router'
import Cookie from '@/tools/cookies'

export default class Posthog {
  private static _posthog?: PostHog
  private static _cookieName = `ph_${Config.posthogApiKey}`

  static install() {
    if (Config.isProduction()) {
      const config = useRuntimeConfig()
      this._posthog = posthog.init(config.public.posthog.apiKey || Config.posthogApiKey, {
        api_host: 'https://eu.i.posthog.com',
        capture_pageview: false,
        capture_pageleave: false,
        persistence: Cookie.getCookieStatus(CookieValue.Posthog) ? 'localStorage+cookie' : 'memory',
        person_profiles: 'always'
      })
    }
  }

  static activatePosthogCookie() {
    this.changePersistance('localStorage+cookie')
  }

  static changePersistance(state: PostHogConfig['persistence']) {
    if (this._posthog) {
      const distinctId = this._posthog.get_distinct_id()
      this._posthog.set_config({ persistence: state })
      this._posthog.identify(distinctId)
    }
  }

  static deactivatePosthogCookie() {
    if (Cookie.areCookiesSet()) {
      this.changePersistance('memory')
      Cookie.removeCookie(this._cookieName, false)
      localStorage.removeItem(this._cookieName)
    }
  }

  static capturePageView(to: RouteLocationNormalized) {
    if (this._posthog) {
      this._posthog.capture('$pageview', { path: to.fullPath })
    }
  }

  static capturePageLeave(from: RouteLocationNormalized) {
    if (this._posthog) {
      this._posthog.capture('$pageleave', { $current_url: window.location.host + from.fullPath, path: from.fullPath })
    }
  }

  static captureEvent(name: string | null = null, value?: object) {
    if (this._posthog) {
      this._posthog.capture(name ? name : 'unnamed event', value)
    }
  }
}
