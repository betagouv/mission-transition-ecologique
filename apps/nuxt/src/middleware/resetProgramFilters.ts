export default defineNuxtRouteMiddleware(() => {
  useProgramStore().resetFilters()
})
