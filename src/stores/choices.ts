import { ref } from 'vue'
import { defineStore } from 'pinia'

export const choicesStore = defineStore('choices', () => {
  
  // internationalization
  const dict: any = {
    fr: {
      next: 'Suivant',
      modify: 'modifier',
      results: 'Vos résultats',
    }
  }

  // language selection
  const lang = ref('fr')

  // actions
  function setLocale(loc: string) {
    lang.value = loc
  }

  return {
    dict,
    lang,
    setLocale
  }
})
