import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const navigationStore = defineStore('navigation', () => {

  // State objects
  const routerReady = ref<boolean>(false)
  const routerRef = ref<any>()
  const routeRef = ref<any>()
  const userQueries = ref<any[]>([])
  const currentTrackId = ref<string>()
  const currentStep = ref<number>()
  const currentDetailId = ref<string | number>('')

  // getters
  const route = computed(() => {
    // console.log('store.navigation > routeRef.value : ', routeRef.value)
    return routeRef.value
  })

  // actions
  function setRouter(router: any) {
    // console.log('store.navigation > setRouter > this.$router : ', this.$router)
    // console.log('store.navigation > setRouter > this.$route : ', this.$route)
    // console.log('store.navigation > setRouter > routeRef.value : ', routeRef.value)
    // cf : https://stackoverflow.com/questions/70681667/cant-use-vue-router-and-pinia-inside-a-single-store
    // routerRef = markRaw(router)
    routerRef.value = router
    routerReady.value = true
  }
  function setRoute(routeObj: any) {
    routeRef.value = routeObj
  }
  function setCurrentTrackId(id: string) {
    currentTrackId.value = id
  }
  function setCurrentStep(step: number) {
    currentStep.value = step
  }
  function setCurrentDetailId(id: string | number) {
    currentDetailId.value = id
    updateUrl()
  }
  function addQuery(query: any) {
    const existingTrackIds = userQueries.value.map(q => q.trackId)
    if (!existingTrackIds.includes(query.trackId)) {
      // console.log('store.navigation > addQuery > query : ', query)
      userQueries.value.push(query)
    }
  }
  // function removeQuery(trackId: string) {
  //   userQueries.value = userQueries.value.filter(q => q.trackId !== trackId)
  // }
  function updateUrl (path: string = 'track', silent: boolean = false) {
    // console.log('store.navigation > updateUrl > routerRef.value : ', routerRef.value)
    // console.log('store.navigation > updateUrl > routeRef.value : ', routeRef.value)

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
    // console.log('store.navigation > updateUrl > trackQueries : ', trackQueries)

    const allQueries = { 
      teeStep: currentStep.value, 
      teeActiveTrack: currentTrackId.value, 
      ...trackQueries,
      teeDetail: currentDetailId.value 
    }
    // console.log('store.navigation > updateUrl > allQueries : ', allQueries)

    // @ts-ignore
    // routerRef.value.replace({ query: allQueries })
    const newRoute = { 
      fullPath: routeRef.value.fullPath,
      // path: `/${path}/${currentTrackId.value}/`, // routeRef.value.path,
      path: routeRef.value.path,
      hash: routeRef.value.hash,
      params: routeRef.value.params,
      meta: routeRef.value.meta,
      name: routeRef.value.name,
      matched: routeRef.value.matched,
      query: allQueries
    }
    // console.log('store.navigation > updateUrl > newRoute : ', newRoute)

    // update browser
    if (silent) {
      routerRef.value.replace(newRoute)
    }
    else {
      routerRef.value.push(newRoute)
    }
  }
  function updateQuery(q: any) {
    // console.log('store.navigation > updateQuery > q : ', q)
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

  function updateQueries(usedTracks: any[]) {
    // console.log('\nstore.navigation > updateQueries > usedTracks : ', usedTracks)
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
      // console.log('store.navigation > updateQueries > q : ', q)
      addQuery(q)
      if (q.selection.length) {
        updateQuery(q)
      }
    })
    // update url in browser
    updateUrl('track', false)
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
    setRouter,
    setRoute,
    setCurrentTrackId,
    setCurrentStep,
    setCurrentDetailId,
    addQuery,
    // removeQuery,
    updateUrl,
    updateQuery,
    updateQueries
  }
})