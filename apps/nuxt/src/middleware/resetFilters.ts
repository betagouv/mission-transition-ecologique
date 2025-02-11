import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware((to, from) => {
  if (from.name !== RouteName.Homepage && to.name === RouteName.CatalogPrograms) {
    useFiltersStore().resetFilters()
  }
})
