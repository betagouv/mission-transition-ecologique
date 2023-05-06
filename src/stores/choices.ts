import { ref } from 'vue'
import { defineStore } from 'pinia'

export const choicesStore = defineStore('choices', () => {
  
  // language selection
  const lang = ref('fr')

  return {
    lang
  }
})
