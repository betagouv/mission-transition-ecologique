import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCompanyDataStore = defineStore('companyData', () => {
  const isDataFull = ref<boolean>(false)
  const hasAnimationDone = ref<boolean>(false)

  function reset() {
    isDataFull.value = false
    hasAnimationDone.value = false
  }

  return {
    isDataFull,
    hasAnimationDone,
    reset
  }
})
