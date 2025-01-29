import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCompanyData = defineStore('companyData', () => {
  const isDataFull = ref<boolean>(false)

  return {
    isDataFull
  }
})
