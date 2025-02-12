import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCompanyDataStore = defineStore('companyData', () => {
  const isDataFull = ref<boolean>(false)

  return {
    isDataFull
  }
})
