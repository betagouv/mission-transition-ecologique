import { ref } from 'vue'
import { defineStore } from 'pinia'

import programsData from '../assets/data/aides.json'

export const programsStore = defineStore('programs', () => {

  const programs = ref(programsData)

  return { 
    programs
  }
})
