import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TrackId, UsedTrackValuePair } from '@/types'
import type { RouteLocationNormalizedLoaded, RouteLocationRaw, Router } from 'vue-router'

export const navigationStore = defineStore('navigation', () => {
  // State objects
  const routerReady = ref<boolean>(false)
  const routerRef = ref<Router>()
  const routeRef = ref<RouteLocationNormalizedLoaded>()
  const userQueries = ref<Partial<UsedTrackValuePair>[]>([])
  const currentTrackId = ref<TrackId>()
  const currentStep = ref<number>()
  const currentDetailId = ref<string | number>('')

  // getters
  const route = computed(() => {
    // console.log('store.navigation > routeRef.value : ', routeRef.value)
    return routeRef.value
  })

  // actions
  function setRouterReady(bool: boolean) {
    routerReady.value = bool
  }
  function setRouter(router: Router) {
    // console.log('store.navigation > setRouter > this.$router : ', this.$router)
    // console.log('store.navigation > setRouter > this.$route : ', this.$route)
    // console.log('store.navigation > setRouter > routeRef.value : ', routeRef.value)
    // cf : https://stackoverflow.com/questions/70681667/cant-use-vue-router-and-pinia-inside-a-single-store
    // routerRef = markRaw(router)
    routerRef.value = router
    setRouterReady(true)
  }
  function setRoute(routeObj: RouteLocationNormalizedLoaded) {
    routeRef.value = routeObj
  }
  function setCurrentTrackId(id: TrackId) {
    currentTrackId.value = id
  }
  function setCurrentStep(step: number) {
    currentStep.value = step
  }
  async function setCurrentDetailId(id: string | number, noWidget: boolean = true) {
    currentDetailId.value = id
    await updateUrl(noWidget)
  }
  function addQuery(query: Partial<UsedTrackValuePair>) {
    const existingTrackIds = userQueries.value.map((q) => q.trackId)
    if (!existingTrackIds.includes(query.trackId)) {
      // console.log('store.navigation > addQuery > query : ', query)
      userQueries.value.push(query)
    }
  }
  // function removeQuery(trackId: string) {
  //   userQueries.value = userQueries.value.filter(q => q.trackId !== trackId)
  // }
  async function updateUrl(noWidget: boolean, forcePath: string | boolean = false) {
    // console.log('store.navigation > updateUrl > routerRef.value : ', routerRef.value)
    // console.log('store.navigation > updateUrl > routeRef.value : ', routeRef.value)

    // existing query

    // loop userQueries and remap as <trackId>: `<selectionKey1>:<selectionValue1>|<selectionKey2>:<selectionValue2>`
    const trackQueries: object = {}
    userQueries.value.map((q) => {
      const selection: any[] = []
      q.selection.forEach((s: object) => {
        for (const [key, value] of Object.entries(s)) {
          selection.push(`${key}:${value}`)
        }
      })
      const resString = selection.join('|')
      trackQueries[`teetrack_${q.trackId}`] = resString
    })
    // console.log('store.navigation > updateUrl > trackQueries : ', trackQueries)

    const allQueries = {
      teeStep: currentStep.value,
      teeActiveTrack: currentTrackId.value,
      ...trackQueries,
      teeDetail: currentDetailId.value
    }
    // console.log('store.navigation > updateUrl > allQueries : ', allQueries)

    // adapt path
    let routePath = routeRef.value.path
    const routeName = forcePath || (routeRef.value.name as string)
    if (noWidget) {
      // console.log('\nstore.navigation > updateUrl > currentDetailId.value : ', currentDetailId.value)
      // console.log('store.navigation > updateUrl > routeName : ', routeName)
      // console.log('store.navigation > updateUrl > routeRef.value.params : ', routeRef.value.params)
      routePath = `/${routeName}`
      // if (!!currentDetailId.value) {
      //   routeName = `${routeName}-detail`
      //   routePath = `/${routeName}/${currentDetailId.value}`
      // } else {
      //   routeName = `${forcePath || routeName.replace(/\d-detail/, '')}`
      //   routePath = `/${routeName}/${currentDetailId.value}`
      // }
    }
    // console.log('store.navigation > updateUrl > routePath : ', routePath)

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
    } as RouteLocationRaw
    // console.log('store.navigation > updateUrl > newRoute : ', newRoute)

    // update browser
    await routerRef.value.push(newRoute)
  }
  function updateQuery(q: Partial<UsedTrackValuePair>) {
    // console.log('store.navigation > updateQuery > q : ', q)
    // update ref
    if (typeof q !== 'undefined') {
      userQueries.value = userQueries.value.map((i) => {
        const iCopy = { ...i }
        if (i.trackId === q.trackId) {
          iCopy.selection = q.selection
        }
        return iCopy
      })
    }
  }

  function updateQueries(usedTracks: UsedTrackValuePair[], noWidget: boolean) {
    if (noWidget) {
      // Do something
    }
    // reset userQueries
    userQueries.value = []
    const queries = usedTracks.map((usedTrack) => {
      const selection = usedTrack.completed ? usedTrack.selection : []
      return {
        trackId: usedTrack.trackId,
        selection: selection
      } as Partial<UsedTrackValuePair>
    })
    queries.forEach((query) => {
      // console.log('store.navigation > updateQueries > q : ', q)
      addQuery(query)
      if (query.selection.length) {
        updateQuery(query)
      }
    })
    // // update url in browser
    // updateUrl(noWidget)
  }
  // function resetQueries() {
  //   userQueries.value = []
  // }

  return {
    routerReady,
    routerRef,
    routeRef,
    route,
    userQueries,
    currentTrackId,
    currentStep,
    currentDetailId,
    setRouter,
    setRoute,
    setCurrentTrackId,
    setCurrentStep,
    setCurrentDetailId,
    updateUrl,
    updateQueries
  }
})
