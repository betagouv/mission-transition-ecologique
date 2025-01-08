import RouteUtils from '@/middleware/utils/routeUtils'

export default defineNuxtRouteMiddleware((to) => {
  useNavigationStore().resetSearchParams()
  if (RouteUtils.hasQuery(to)) {
    return navigateTo({ ...to, query: undefined })
  }
})
