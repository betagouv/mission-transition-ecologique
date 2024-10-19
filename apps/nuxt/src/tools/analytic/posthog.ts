import posthog, { PostHog } from 'posthog-js'
import Config from '@/config'
import Cookie from '@/tools/cookies'
import { CookieValue } from '@/types/cookies'
import { RouteLocationNormalized } from 'vue-router'

export default class Posthog {
  private static _posthog?: PostHog

  static install() {
    if (Config.isProduction()) {
      this._posthog = posthog.init(Config.posthogApiKey, {
        api_host: 'https://eu.i.posthog.com',
        capture_pageview: false,
        capture_pageleave: false,
        person_profiles: 'always'
      })
    }
  }

  static activatePosthogCookie() {
    if (this._posthog) {
      this._posthog.opt_in_capturing()
    }
  }

  static deactivatePosthogCookie() {
    if (this._posthog) {
      this._posthog.opt_out_capturing()
    }
  }

  static capturePageView(to: RouteLocationNormalized) {
    if (this._posthog) {
      const posthogCookie = Cookie.getCookieByValue(CookieValue.Posthog)
      if (posthogCookie?.accepted) {
        this._posthog.capture('$pageview', { path: to.fullPath })
      }
    }
  }

  static capturePageLeave(from: RouteLocationNormalized) {
    if (this._posthog) {
      this._posthog.capture('$pageleave', { $current_url: window.location.host + from.fullPath, path: from.fullPath })
    }
  }

  static captureEvent(action: string, name: string | null = null, value?: string | number | object | Record<string, string | number>) {
    if (this._posthog) {
      this._posthog.capture(name ? name : 'unnamed event', { action: action, value: value })
    }
  }
}
