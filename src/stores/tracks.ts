import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { tracks } from '../utils'

export const tracksStore = defineStore('tracks', () => {
  const lang = ref('fr')
  console.log('store > tracks > tracks : ', tracks)
  
  const maxDepth = ref(4)

  const allTracks = ref(tracks)
  const seedTrack = ref()
  const currentTrack = ref()

  const userChoices = ref()

  // computed
  const currentTrackConfig = computed(() => currentTrack.value.config)
  // TO DO
  // stepsArray = 

  // methods
  function setMaxDepth(depth: number) { maxDepth.value = depth }
  function setSeedTrack(seed: string) {
    const track = tracks.find(track => track.id === seed)
    console.log('store > tracks > track : ', track)
    seedTrack.value = track
    currentTrack.value = track
    userChoices.value = {
      id: track?.id,
      values: []
    }
  }

  return { 
    lang,
    maxDepth,
    setMaxDepth,
    allTracks,
    seedTrack,
    currentTrackConfig,
    setSeedTrack,
    userChoices,
    // step,
    // steps, 
    // stepsArr, changeStep
  }
})
