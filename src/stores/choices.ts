import { ref } from 'vue'
import { defineStore } from 'pinia'

export const choicesStore = defineStore('choices', () => {
  
  // language selection
  const lang = ref('fr')

  // actions
  function setLocale(loc: string) {
    lang.value = loc
  }

  return {
    lang,
    setLocale
  }
})
