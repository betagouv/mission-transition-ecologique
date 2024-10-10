import Posthog from '@/tools/analytic/posthog'

export default defineNuxtRouteMiddleware(() => {
  const router = useRouter()
  router.afterEach((to, _, failure) => {
    if (!failure) {
      nextTick(() => {
        Posthog.capturePageView(to)
      })
    }
  })
})
