import Hook from '@/app-backup/router/hook'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (Hook.hasQuery(to) && !Hook.hasNameRoute(from)) {
    useNavigationStore().setSearchParams(to.query)
    await useUsedTrackStore().setFromNavigation()
  }
})