import posthog, { PostHog } from 'posthog-js'
import Config from '@/config'
import { RouteLocationNormalized } from 'vue-router'
import Cookie from '../cookies'

export default class Posthog {
  private static _posthog?: PostHog

  static install() {
    if (Config.isProduction()) {
      this._posthog = posthog.init(Config.posthogApiKey, {
        api_host: 'https://eu.i.posthog.com',
        capture_pageview: false,
        capture_pageleave: false,
        persistence: 'memory',
        person_profiles: 'always'
      })
    }
  }

  static activatePosthogCookie() {
    this.changePersistance('localStorage+cookie')
  }

  static resetPosthog() {
    if (this._posthog) {
      this._posthog.reset()
    }
  }
  static changePersistance(state: 'memory' | 'localStorage' | 'cookie' | 'localStorage+cookie' | 'sessionStorage') {
    if (this._posthog) {
      const distinctId = this._posthog.get_distinct_id()
      this._posthog.set_config({ persistence: state })
      this._posthog.identify(distinctId)
    }
  }
  static deactivatePosthogCookie() {
    if (Cookie.areCookiesSet()) {
      this.changePersistance('memory')
      Cookie.removeCookie(`ph_${Config.posthogApiKey}`, false)
      localStorage.removeItem(`ph_${Config.posthogApiKey}`)
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
