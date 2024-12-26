import Posthog from '@/tools/analytic/posthog'
import Matomo from './matomo'

export default class Analytics {
  static sendEvent(action: string, name: string | null = null, value?: object) {
    if (import.meta.client) {
      Posthog.captureEvent(name ? name : 'unnamed event', value)
      Matomo.sendEvent(action, name, JSON.stringify(value))
    }
  }
}
