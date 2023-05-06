import { ref } from 'vue'
import { defineStore } from 'pinia'

import { tracksStore } from './tracks'

import programsData from '../assets/data/aides.json'

export const programsStore = defineStore('programs', () => {

  // import from tracks
  const tracks = tracksStore()

  const programs = ref(programsData)

  return { 
    programs
  }
})
