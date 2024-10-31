import Hook from '@/app-backup/router/hook'

export default defineNuxtRouteMiddleware((to) => {
  useNavigationStore().resetSearchParams()
  if (Hook.hasQuery(to)) {
    return navigateTo({ ...to, query: undefined })
  }
})
