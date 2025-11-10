// CONSOLE LOG TEMPLATE
// console.log(`store.navigation > FUNCTION_NAME > MSG_OR_VALUE :`)

import { TrackId } from '@/types'
import type { UrlParam } from '@/types/navigation'
import Navigation from '@/tools/navigation'
import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { type LocationQuery, type LocationQueryValue, type RouteLocationAsRelativeGeneric, RouteLocationRaw } from 'vue-router'
import { RouteName } from '@/types/routeType'

export const useNavigationStore = defineStore('navigation', () => {
  const stringOfSearchParams = ref<string>('')
  const tabSelectedOnList = ref<number>(0)
  const hasSpinner = ref<boolean>(false)
  const hasRegisterModal = ref<boolean>(false)
  const isFromCtaRegisterModal = ref<boolean>(false)
  const isFromQuestionnaireCtaRegisterModal = ref<boolean>(false)
  const query = computed<Record<string, LocationQueryValue | LocationQueryValue[]>>(() => {
    const query: LocationQuery = {}
    for (const key of getURLSearchParams().keys()) {
      addQueryByKey(key, query)
    }

    return query
  })

  function addQueryByKey(key: string, query: LocationQuery) {
    if (!(key in query)) {
      const values = getURLSearchParams().getAll(key)
      query[key] = values.length > 1 ? values : values[0]
    }

    return query
  }

  function queryByUsedTrackId(usedTrackId: string) {
    const query: LocationQuery = {}
    for (const key of getURLSearchParams().keys()) {
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

    if (TrackId.BuildingProperty === trackId) {
      route = {
        ...route,
        name: RouteName.QuestionnaireStart,
        query: undefined,
        params: {}
      }
    }

    return route
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

  function deleteSearchParam(name: string, searchParams: URLSearchParams | undefined = undefined) {
    const params = searchParams ?? getURLSearchParams()
    if (params.has(name)) {
      params.delete(name)
      setStringOfSearchParams(params)
    }
  }

  function getURLSearchParams(): URLSearchParams {
    return new URLSearchParams(stringOfSearchParams.value)
  }

  function setSearchParam(name: string, value: string | string[]) {
    const searchParams = getURLSearchParams()
    if (Array.isArray(value)) {
      deleteSearchParam(name, searchParams)
      value.forEach((value) => searchParams.append(name, value))
    } else {
      searchParams.set(name, value)
    }

    setStringOfSearchParams(searchParams)
  }

  function replaceBrowserHistory(): void {
    history.replaceState({}, '', `?${stringOfSearchParams.value}`)
  }

  function setStringOfSearchParams(searchParams: URLSearchParams) {
    stringOfSearchParams.value = searchParams.toString()
  }

  function resetSearchParams() {
    stringOfSearchParams.value = ''
  }

  function setFromCtaRegisterModal(value: boolean) {
    isFromQuestionnaireCtaRegisterModal.value = false
    isFromCtaRegisterModal.value = value
  }

  function setFromQuestionnaireCtaRegisterModal(value: boolean) {
    isFromCtaRegisterModal.value = false
    isFromQuestionnaireCtaRegisterModal.value = value
  }

  function resetFromCtaRegisterModal() {
    isFromCtaRegisterModal.value = false
    isFromQuestionnaireCtaRegisterModal.value = false
  }

  return {
    query,
    tabSelectedOnList,
    hasSpinner,
    hasRegisterModal,
    isFromCtaRegisterModal,
    isFromQuestionnaireCtaRegisterModal,
    resetSearchParams,
    setSearchParams,
    updateSearchParam,
    deleteSearchParam,
    routeByTrackId,
    replaceBrowserHistory,
    setFromCtaRegisterModal,
    setFromQuestionnaireCtaRegisterModal,
    resetFromCtaRegisterModal
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigationStore, import.meta.hot))
}
