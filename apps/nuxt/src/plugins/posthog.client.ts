import Posthog from '@/tools/analytic/posthog'

export default defineNuxtPlugin(() => {
  Posthog.install()

  const router = useRouter()
  router.afterEach((to, from, failure) => {
    if (!failure) {
      return nextTick(() => {
        Posthog.capturePageView(to)
        Posthog.capturePageLeave(from)
      })
    }
  })
})
