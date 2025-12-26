import RouteUtils from '@/middleware/utils/routeUtils'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (RouteUtils.hasQuery(to) && !RouteUtils.hasNameRoute(from)) {
    useNavigationStore().setSearchParams(to.query)
    await useUsedTrackStore().setFromNavigation()
  }
})
