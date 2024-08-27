import posthog from 'posthog-js'

export default class Analytics {
  static sendEvent(action: string, name: string | null = null, value?: string | number | undefined) {
    if (window.posthog) {
      posthog.capture(name ? name : 'unnamed event', { action: action, value: value })
    }
  }
}
