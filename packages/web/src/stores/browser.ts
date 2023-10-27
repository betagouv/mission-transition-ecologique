import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const browserStore = defineStore('browser', () => {
  
  // route
  const routerRef = ref<any>()
  const routeRef = ref<any>()

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
    // browserQuery.value = query
  }

  return {
    routeRef,
    routeVal,
    setRouter,
    setRoute,
    setQuery
  }
})
