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
  type RouteLocationAsRelativeGeneric,
  type Router,
  RouteParamsGeneric
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

  function isCatalogPrograms() {
    return isByRouteName(RouteName.CatalogPrograms)
  }

  function isCatalogProjects() {
    return isByRouteName(RouteName.CatalogProjects)
  }

  function isCatalogProjectDetail() {
    return isByRouteName(RouteName.CatalogProjectDetail)
  }

  function isCatalogProgramDetail() {
    return isByRouteName([RouteName.CatalogProgramDetail, RouteName.CatalogProgramFromCatalogProjectDetail])
  }

  function isCatalogAboutPrograms() {
    return isCatalogPrograms() || isCatalogProgramDetail()
  }

  function isCatalogAboutProjects() {
    return isCatalogProjects() || isCatalogProjectDetail()
  }

  function isCatalogList() {
    return isByRouteName([RouteName.CatalogPrograms, RouteName.CatalogProjects])
  }

  function isCatalogDetail() {
    return isCatalogProgramDetail() || isCatalogProjectDetail()
  }

  function isCatalog() {
    return isCatalogDetail() || isCatalogList()
  }

  function isQuestionnaire() {
    return isQuestionnaireResult() || isQuestionnaireResultDetail()
  }

  function isQuestionnaireResult() {
    return isByRouteName(RouteName.QuestionnaireResult)
  }

  function isQuestionnaireResultDetail() {
    return isByRouteName([RouteName.QuestionnaireResultDetail, RouteName.ProgramFromProjectDetail, RouteName.ProjectResultDetail])
  }

  function isProgramFromProject() {
    return isByRouteName([RouteName.ProgramFromProjectDetail, RouteName.CatalogProgramFromCatalogProjectDetail])
  }

  function isStaticPage() {
    return !isQuestionnaire() && !isCatalog()
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

  function getAbsoluteUrlByRouteName(routeName: RouteName, params: RouteParamsGeneric = {}): string | undefined {
    if (router.value) {
      return new URL(router.value.resolve({ name: routeName, params: params }).href, window.location.origin).href
    }
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
    isCatalogAboutPrograms,
    isCatalogAboutProjects,
    isCatalogPrograms,
    isCatalogProjects,
    isCatalogProjectDetail,
    isCatalogProgramDetail,
    isCatalogList,
    isCatalogDetail,
    isProgramFromProject,
    isByRouteName,
    resetSearchParams,
    setRouter,
    isQuestionnaire,
    isQuestionnaireResult,
    isQuestionnaireResultDetail,
    isStaticPage,
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
