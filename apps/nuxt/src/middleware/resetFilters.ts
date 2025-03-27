import Navigation from '@/tools/navigation'

export default defineNuxtRouteMiddleware(() => {
  if (new Navigation().isQuestionnaire()) {
    useFiltersStore().resetFilters()
  }
})
