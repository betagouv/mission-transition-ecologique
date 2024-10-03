import Posthog from '@/utils/analytic/posthog'

export default class PostHogPlugin {
  static install() {
    Posthog.install()
  }
}
