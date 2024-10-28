// CONSOLE LOG TEMPLATE
//console.log(`router.index > FUNCTION_NAME > MSG_OR_VALUE :`)

import Posthog from '@/utils/analytic/posthog'
import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteLocationNormalizedLoaded } from 'vue-router'
import { routes } from '@/router/routes'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior(to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, savedPosition) {
    if (savedPosition) {
      return Promise.resolve(savedPosition)
    }
    return { top: 0 }
  },
  routes: routes
})

router.afterEach((to, from, failure) => {
  if (!failure) {
    nextTick(() => {
      Posthog.capturePageView(to)
      Posthog.capturePageLeave(from)
    })
  }
})

export { router }
