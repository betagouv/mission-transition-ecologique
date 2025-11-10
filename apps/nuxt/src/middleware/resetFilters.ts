import Navigation from '@/tools/navigation'

export default defineNuxtRouteMiddleware((to) => {
  const navigation = Navigation.getInstance(to)
  if (navigation.isQuestionnaire()) {
    useFiltersStore().resetFilters()
  }
})
