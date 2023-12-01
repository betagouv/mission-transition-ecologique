// CONSOLE LOG TEMPLATE
// console.log(`store.navigation > FUNCTION_NAME > MSG_OR_VALUE :`)

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TrackId } from '@/types'

export const navigationStore = defineStore('navigation', () => {

  // State objects
  const routerReady = ref<boolean>(false)
  const routerRef = ref<any>()
  const routeRef = ref<any>()
  const userQueries = ref<any[]>([])
  const currentTrackId = ref<TrackId>()
  const currentStep = ref<number>()
  const currentDetailId = ref<string | number>('')

  // getters
  const route = computed(() => {
    return routeRef.value
  })

  // actions
  function setRouterReady(bool: boolean) {
    routerReady.value = bool
  }
  function setRouter(router: any) {
    // cf : https://stackoverflow.com/questions/70681667/cant-use-vue-router-and-pinia-inside-a-single-store
    routerRef.value = router
    setRouterReady(true)
  }
  function setRoute(routeObj: any) {
    routeRef.value = routeObj
  }
  function setCurrentTrackId(id: TrackId) {
    currentTrackId.value = id
  }
  function setCurrentStep(step: number) {
    currentStep.value = step
  }
  function setCurrentDetailId(id: string | number, noWidget: boolean) {
    currentDetailId.value = id
    updateUrl(noWidget)
  }
  function addQuery(query: any) {
    const existingTrackIds = userQueries.value.map(q => q.trackId)
    if (!existingTrackIds.includes(query.trackId)) {
      userQueries.value.push(query)
    }
  }
  // function removeQuery(trackId: string) {
  //   userQueries.value = userQueries.value.filter(q => q.trackId !== trackId)
  // }
  function updateUrl (noWidget: boolean, forcePath: string | boolean = false) {
    // existing query

    // loop userQueries and remap as <trackId>: `<selectionKey1>:<selectionValue1>|<selectionKey2>:<selectionValue2>`
    const trackQueries: any = {}
    userQueries.value.map(q => {
      const selection: any[] = []
      q.selection.forEach((s: object) => {
        for (const [key, value] of Object.entries(s)) {
          selection.push(`${key}:${value}`)
        }
      })
      const resString = selection.join('|')
      trackQueries[`teetrack_${q.trackId}`] = resString
    })

    const allQueries = { 
      teeStep: currentStep.value, 
      teeActiveTrack: currentTrackId.value, 
      ...trackQueries,
      teeDetail: currentDetailId.value 
    }

    // adapt path
    let routePath = routeRef.value.path
    const routeName = forcePath || routeRef.value.name
    if (noWidget) {
      routePath = `/${routeName}`
      // if (!!currentDetailId.value) {
      //   routeName = `${routeName}-detail`
      //   routePath = `/${routeName}/${currentDetailId.value}`
      // } else {
      //   routeName = `${forcePath || routeName.replace(/\d-detail/, '')}`
      //   routePath = `/${routeName}/${currentDetailId.value}`
      // }
    }

    // @ts-ignore
    // routerRef.value.replace({ query: allQueries })
    const newRoute = { 
      // fullPath: routeRef.value.fullPath,
      // path: routeRef.value.path,
      path: routePath,
      // hash: routeRef.value.hash,
      // params: routeRef.value.params,
      // meta: routeRef.value.meta,
      name: routeName,
      // name: routeRef.value.name,
      // matched: routeRef.value.matched,
      query: allQueries
    }

    // update browser
    routerRef.value.push(newRoute)
  }
  function updateQuery(q: any) {
    // update ref
    if (typeof q !== 'undefined') {
      const query = userQueries.value.map(i => {
        const iCopy = {...i}
        if (i.trackId === q.trackId) {
          iCopy.selection = q.selection
        }
        return iCopy
      })
      userQueries.value = query
    }
  }

  function updateQueries(usedTracks: any[], noWidget: boolean) {
    // reset userQueries
    userQueries.value = []
    const queries = usedTracks.map(t => {
      const selection = t.completed ? t.selection : []
      return {
        trackId: t.trackId,
        selection: selection
      }
    })
    queries.forEach(q => {
      addQuery(q)
      if (q.selection.length) {
        updateQuery(q)
      }
    })
    // update url in browser
    // updateUrl(noWidget)
  }
  function resetQueries() {
    userQueries.value = []
  }

  return {
    routerReady,
    routerRef,
    routeRef,
    route,
    userQueries,
    currentTrackId,
    currentStep,
    currentDetailId,
    setRouterReady,
    setRouter,
    setRoute,
    setCurrentTrackId,
    setCurrentStep,
    setCurrentDetailId,
    addQuery,
    // removeQuery,
    updateUrl,
    updateQuery,
    updateQueries,
    resetQueries
  }
})