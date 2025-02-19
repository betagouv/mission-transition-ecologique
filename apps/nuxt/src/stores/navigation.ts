// CONSOLE LOG TEMPLATE
// console.log(`store.navigation > FUNCTION_NAME > MSG_OR_VALUE :`)

import { TrackId } from '@/types'
import type { UrlParam } from '@/types/navigation'
import Navigation from '@/tools/navigation'
import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import {
  type LocationQuery,
  type LocationQueryValue,
  type RouteLocationNormalizedLoaded,
  type RouteLocationRaw,
  type RouteLocationAsRelativeGeneric,
  type Router,
  RouteParamsGeneric
} from 'vue-router'
import { RouteName } from '@/types/routeType'

export const useNavigationStore = defineStore('navigation', () => {
  const router = ref<Router>()
  const route = ref<RouteLocationNormalizedLoaded>()
  const searchParams = ref<URLSearchParams>(new URLSearchParams())
  const stringOfSearchParams = ref<string>('')
  const tabSelectedOnList = ref<number>(0)
  const hasSpinner = ref<boolean>(false)
  const hasRegisterModal = ref<boolean>(false)
  const query = computed<Record<string, LocationQueryValue | LocationQueryValue[]>>(() => {
    const query: LocationQuery = {}
    for (const key of new URLSearchParams(stringOfSearchParams.value).keys()) {
      addQueryByKey(key, query)
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
    const query: LocationQuery = {}
    for (const key of new URLSearchParams(stringOfSearchParams.value).keys()) {
      if (key === usedTrackId) {
        break
      }
      addQueryByKey(key, query)
    }

    return query
  }

  function routeByTrackId(trackId: TrackId): RouteLocationAsRelativeGeneric {
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

  function setRouter(useRouter: Router) {
    router.value = useRouter
  }

  function setRoute(useRoute: RouteLocationNormalizedLoaded) {
    route.value = useRoute
  }
  function resolveUrl(routeName: RouteLocationAsRelativeGeneric, params?: RouteParamsGeneric) {
    const fallbackPath = '/'

    try {
      if (router.value) {
        const resolvedRoute = router.value.resolve({ ...routeName, params })

        if (resolvedRoute) {
          return resolvedRoute
        }
        console.error(`Error during route resolution : ${routeName}`)
      }
    } catch (error) {
      console.error(`Error during URL resolution for ${routeName}`, error)
    }

    // En cas d'erreur, on retourne un fallback propre
    return {
      href: fallbackPath,
      path: fallbackPath
    }
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
    const params = new URLSearchParams(searchParams.value.toString())
    if (params.has(name)) {
      params.delete(name)
      searchParams.value = params
      setStringOfSearchParams()
    }
  }

  function setSearchParam(name: string, value: string | string[]) {
    if (Array.isArray(value)) {
      deleteSearchParam(name)
      value.forEach((value) => searchParams.value.append(name, value))
    } else {
      const params = new URLSearchParams(searchParams.value.toString())
      params.set(name, value)
      searchParams.value = params
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

  function getAbsoluteUrlByRouteName(routeName: RouteName, params: RouteParamsGeneric = {}): string | undefined {
    if (router.value) {
      return new URL(resolveUrl({ name: routeName, params: params }).href, window.location.origin).href
    }
  }

  return {
    router,
    route,
    query,
    searchParams,
    tabSelectedOnList,
    hasSpinner,
    hasRegisterModal,
    resetSearchParams,
    resolveUrl,
    setRouter,
    setRoute,
    setSearchParams,
    updateSearchParam,
    deleteSearchParam,
    routeByTrackId,
    replaceBrowserHistory,
    getAbsoluteUrlByRouteName
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigationStore, import.meta.hot))
}
