import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDebugStore = defineStore('debug', () => {
  // language selection
  const is = ref<boolean>(false)
  const hasSwitch = ref<boolean>(false)

  return {
    is,
    hasSwitch
  }
})
