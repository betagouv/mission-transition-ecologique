// CONSOLE LOG TEMPLATE
// console.log(`store.navigation > FUNCTION_NAME > MSG_OR_VALUE :`)

import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { type RouteLocationNormalizedLoaded, type Router } from 'vue-router'
import { RouteName } from '@/types/routeType'

export const useNavigationStore = defineStore('navigation', () => {
  const isReady = ref<boolean>(false)
  const router = ref<Router>()
  const route = ref<RouteLocationNormalizedLoaded>()
  const searchParams = ref(new URLSearchParams())

  const query = computed(() => {
    return Object.fromEntries(searchParams.value)
  })

  function isCatalog() {
    return isByRouteName(RouteName.Catalog)
  }

  function isByRouteName(routeName: string) {
    return route.value?.name === routeName
  }

  function setIsReady(bool: boolean) {
    isReady.value = bool
  }

  function setRouter(useRouter: Router) {
    router.value = useRouter
    setIsReady(true)
  }

  function setRoute(useRoute: RouteLocationNormalizedLoaded) {
    route.value = useRoute
  }

  function updateQuery(param: { name: string; value: string | string[] }) {
    if (!Array.isArray(param.value) && param.value !== '' && param.value !== undefined) {
      searchParams.value.set(param.name, param.value)
    } else if (Array.isArray(param.value) && param.value.length > 0) {
      searchParams.value.delete(param.name)
      param.value.forEach((value) => {
        searchParams.value.append(param.name + '[]', value)
      })
    }
  }

  function resetQueries() {
    searchParams.value = new URLSearchParams()
  }

  return {
    isReady,
    router,
    route,
    query,
    isCatalog,
    isByRouteName,
    resetQueries,
    setRouter,
    setRoute,
    updateQuery
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigationStore, import.meta.hot))
}
