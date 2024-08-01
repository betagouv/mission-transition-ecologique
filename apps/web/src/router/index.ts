// CONSOLE LOG TEMPLATE
//console.log(`router.index > FUNCTION_NAME > MSG_OR_VALUE :`)

import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteLocationNormalizedLoaded } from 'vue-router'
import { routes } from '@/router/routes'
import { RouteName } from '@/types'

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior(to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(
          () => {
            resolve({ el: to.hash, behavior: 'instant' })
          },
          from.name === RouteName.ProgramFromProjectDetail ? 500 : 0
        )
      })
    }
    return { top: 0 }
  },
  routes: routes
})
