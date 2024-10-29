import { routes } from '@/app-backup/router/routes'
import type { RouterConfig } from '@nuxt/schema'
import { createWebHistory, type RouteLocationNormalized, type RouteLocationNormalizedLoaded } from 'vue-router'

export default {
  history: import.meta.client ? () => createWebHistory(process.env.BASE_URL) : undefined,
  scrollBehavior(to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, savedPosition) {
    if (savedPosition) {
      return Promise.resolve(savedPosition)
    }
    return { top: 0 }
  },
  routes: (_routes) => routes
} satisfies RouterConfig
