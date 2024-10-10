import Posthog from '@/tools/analytic/posthog'

class PostHogPlugin {
  static install() {
    Posthog.install()
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PostHogPlugin)
})
