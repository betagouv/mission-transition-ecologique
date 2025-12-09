import RouteUtils from '@/middleware/utils/routeUtils'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log(to.query)
  console.log(RouteUtils.hasQuery(to) && !RouteUtils.hasNameRoute(from))
  console.log(RouteUtils.hasQuery(to))
  console.log(!RouteUtils.hasNameRoute(from))
  if (RouteUtils.hasQuery(to) && !RouteUtils.hasNameRoute(from)) {
    useNavigationStore().setSearchParams(to.query)
    await useUsedTrackStore().setFromNavigation()
  }
})
