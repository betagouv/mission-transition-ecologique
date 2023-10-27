import { ref } from 'vue'
import { defineStore } from 'pinia'

export const browserStore = defineStore('browser', () => {
  
  // query
  const browserQuery = ref()

  // actions
  function setQuery(query: object) {
    browserQuery.value = query
  }

  return {
    setQuery
  }
})
