import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { tracks } from '../utils'

export const tracksStore = defineStore('tracks', () => {
  console.log('store > tracks > tracks : ', tracks)
  
  const maxDepth = ref(4)
  const stepsLog = ref({})

  const allTracks = ref(tracks)
  const seedTrack = ref()
  const currentTrack = ref()

  const userChoices = ref()

  // computed
  const currentTrackId = computed(() => currentTrack.value.id)
  const currentTrackConfig = computed(() => currentTrack.value.config)
  const nextTrack = computed(() => {
    const nextTrackId = currentTrack.value.next.default
    return tracks.find(t => t.id === nextTrackId)
  })
  // TO DO
  const tracksStepsArray = computed(() => {
    return [
      currentTrack.value.id,
      currentTrack.value.next.default,
      'results'
    ]
  })

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
    maxDepth,
    stepsLog,
    setMaxDepth,
    allTracks,
    seedTrack,
    currentTrackId,
    currentTrackConfig,
    nextTrack,
    tracksStepsArray,
    setSeedTrack,
    userChoices,
    // step,
    // steps, 
    // stepsArr, changeStep
  }
})
