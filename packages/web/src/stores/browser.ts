import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const browserStore = defineStore('browser', () => {
  
  // route
  const routerRef = ref<any>()
  const routeRef = ref<any>()
  const userQueries = ref<any[]>([])

  // getters
  const routeVal = computed(() => {
    const routeVal = routeRef.value
    console.log('store.browser > routeVal : ', routeVal)
    return routeVal
  })

  // actions
  function setRouter(router: any) {
    console.log('store.browser > setRouter > router : ', router)
    routerRef.value = router
  }
  function setRoute(route: any) {
    console.log('store.browser > setRoute > route : ', route)
    routeRef.value = route 
  }
  function setQuery(query: object) {
    userQueries.value.push(query)
  }
  function updateUrl () {
    console.log('store.browser > setRoute > routerRef.value : ', routerRef.value)
    // TO DO
    // const res: any = {}
    // existing query
    const urlQueries = routeRef.value.query
    // const urlParams = routeRef.value.params
    console.log('store.browser > setRoute > urlQueries : ', urlQueries)
    // console.log('store.browser > setRoute > urlParams : ', urlParams)
    
    // loop userQueries and remap as <trackId>: `<selectionKey1>:<selectionValue1>|<selectionKey2>:<selectionValue2>`
    const newQueries: any = {}
    userQueries.value.map(q => {
      const selection: any[] = []
      q.selection.forEach((s: object) => {
        for (const [key, value] of Object.entries(s)) {
          selection.push(`${key}:${value}`)
        }
      })
      const resString = selection.join('|')
      newQueries[q.trackId] = resString
    })
    console.log('store.browser > setRoute > newQueries : ', newQueries)
    // Silently update url router
    console.log('store.browser > setRoute > routerRef.value : ', routerRef.value)
    const allQueries = {...urlQueries, ...newQueries}
    routerRef.value.replace({ query: allQueries })
  }
  function updateQuery(q: any) {
    // update ref
    const query = userQueries.value.map(i => {
      const iCopy = {...i}
      if (i.trackId === q.trackId) {
        iCopy.selection = q.selection
      }
      return iCopy
    })
    userQueries.value = query

    // set url in browser
    updateUrl()
  }

  return {
    routeRef,
    routeVal,
    userQueries,
    setRouter,
    setRoute,
    setQuery,
    updateUrl,
    updateQuery
  }
})
