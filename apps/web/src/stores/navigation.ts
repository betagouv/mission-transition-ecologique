// CONSOLE LOG TEMPLATE
// console.log(`store.navigation > FUNCTION_NAME > MSG_OR_VALUE :`)

import { TrackId } from '@/types'
import type { UrlParam } from '@/types/navigation'
import Navigation from '@/utils/navigation'
import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import {
  type LocationQuery,
  type LocationQueryValue,
  type RouteLocationNormalizedLoaded,
  type RouteLocationRaw,
  type Router
} from 'vue-router'
import { RouteName } from '@/types/routeType'

export const useNavigationStore = defineStore('navigation', () => {
  const isReady = ref<boolean>(false)
  const router = ref<Router>()
  const route = ref<RouteLocationNormalizedLoaded>()
  const searchParams = ref<URLSearchParams>(new URLSearchParams())
  const stringOfSearchParams = ref<string>('')
  const tabSelectedOnList = ref<number>(0)
  const hasSpinner = ref<boolean>(false)

  const query = computed<Record<string, LocationQueryValue | LocationQueryValue[]>>(() => {
    let query: LocationQuery = {}
    for (const key of new URLSearchParams(stringOfSearchParams.value).keys()) {
      query = addQueryByKey(key, query)
    }

    return query
  })

  function addQueryByKey(key: string, query: LocationQuery) {
    if (!(key in query)) {
      const values = searchParams.value.getAll(key)
      query[key] = values.length > 1 ? values : values[0]
    }

    return query
  }

  function queryByUsedTrackId(usedTrackId: string) {
    let query: LocationQuery = {}
    for (const key of new URLSearchParams(stringOfSearchParams.value).keys()) {
      if (key === usedTrackId) {
        break
      }
      query = addQueryByKey(key, query)
    }

    return query
  }

  function routeByTrackId(trackId: TrackId) {
    let route: RouteLocationRaw = {
      name: RouteName.Questionnaire,
      params: { trackId: trackId },
      hash: Navigation.hashByRouteName(RouteName.Questionnaire),
      query: queryByUsedTrackId(trackId)
    }

    if (TrackId.QuestionnaireRoute === trackId) {
      route = {
        ...route,
        name: RouteName.QuestionnaireStart,
        query: undefined,
        params: {}
      }
    }

    return route
  }

  function isCatalog() {
    return isByRouteName(RouteName.Catalog)
  }

  function isByRouteName(routeName: string | string[]) {
    if (Array.isArray(routeName) && route.value?.name) {
      return new Set(routeName).has(route.value.name as string)
    }
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

  function updateSearchParams(query: LocationQuery) {
    Object.entries(query).forEach(([key, value]) => {
      updateSearchParam({ name: key, value: value } as UrlParam)
    })
  }

  function setSearchParams(query: LocationQuery) {
    resetSearchParams()
    updateSearchParams(query)
  }

  function updateSearchParam(param: UrlParam) {
    if (param.value === '' || param.value === undefined || param.value === null) {
      deleteSearchParam(param.name)
    } else {
      setSearchParam(param.name, param.value)
    }
  }

  function deleteSearchParam(name: string) {
    searchParams.value.delete(name)
    setStringOfSearchParams()
  }

  function setSearchParam(name: string, value: string | string[]) {
    if (Array.isArray(value)) {
      deleteSearchParam(name)
      value.forEach((value) => searchParams.value.append(name, value))
    } else {
      searchParams.value.set(name, value)
    }

    setStringOfSearchParams()
  }

  function replaceBrowserHistory(): void {
    history.replaceState({}, '', `?${stringOfSearchParams.value}`)
  }

  function setStringOfSearchParams() {
    stringOfSearchParams.value = searchParams.value.toString()
  }

  function resetSearchParams() {
    searchParams.value = new URLSearchParams()
    stringOfSearchParams.value = ''
  }

  return {
    isReady,
    router,
    route,
    query,
    searchParams,
    tabSelectedOnList,
    hasSpinner,
    isCatalog,
    isByRouteName,
    resetSearchParams,
    setRouter,
    setRoute,
    setSearchParams,
    updateSearchParam,
    deleteSearchParam,
    routeByTrackId,
    replaceBrowserHistory
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigationStore, import.meta.hot))
}
