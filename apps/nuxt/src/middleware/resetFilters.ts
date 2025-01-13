export default defineNuxtRouteMiddleware(() => {
  useFiltersStore().resetFilters()
})
