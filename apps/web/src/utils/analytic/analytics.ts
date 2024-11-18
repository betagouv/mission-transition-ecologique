import Posthog from '@/utils/analytic/posthog'
import Matomo from './matomo'

export default class Analytics {
  static sendEvent(action: string, name: string | null = null, value?: object) {
    Posthog.captureEvent(name ? name : 'unnamed event', value)
    Matomo.sendEvent(action, name, JSON.stringify(value))
  }
}
