import Hook from '@/middleware/hook/hook'

export default defineNuxtRouteMiddleware((to) => {
  useNavigationStore().resetSearchParams()
  if (Hook.hasQuery(to)) {
    return navigateTo({ ...to, query: undefined })
  }
})
