import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { tracks } from '../utils'

export const tracksStore = defineStore('tracks', () => {
  // console.log('store.tracks > defineStore > tracks : ', tracks)
  
  const maxDepth = ref(4)

  const allTracks = ref(tracks)
  const seedTrack = ref()

  interface UsedTrack {
    id: string | any,
    final?: boolean,
    completed: boolean,
    step: number,
    values: any[],
    next: any
  }
  const usedTracks = ref<UsedTrack[]>([])

  // computed
  const tracksStepsArrayDict = computed(() => {
    const dict = allTracks.value.map((t: any) => {
      return {
        id: t.id,
        label: t.label
      }
    })
    return dict
  })
  const tracksStepsArray = computed(() => {
    const tracksArray = usedTracks.value.map((t: UsedTrack) => t.id)
    const lastTrack = tracksArray[tracksArray.length - 1]
    if (lastTrack !== 'results') {
      tracksArray.push('results')
    }
    return tracksArray
  })
  const currentStep = computed(() => {
    const tracksArray = usedTracks.value.slice(-1)
    const track: UsedTrack = tracksArray[0]
    const stepNumber = track.step
    return stepNumber
  })

  // getters
  function getTrack(trackId: string) {
    const track = tracks.find(track => track.id === trackId)
    return track
  }
  function trackExistsInUsed(trackId: string) {
    // @ts-ignore
    const exists = usedTracks.value.find(t => t.id === trackId)
    return !!exists
  }

  // actions
  function setMaxDepth(depth: number) { maxDepth.value = depth }

  function setSeedTrack(seed: string) {
    // console.log()
    // console.log('store.tracks > addToUsedTracks > seed : ', seed)
    const track = getTrack(seed)
    // console.log('store.tracks > setSeedTrack > track : ', track)
    seedTrack.value = track?.id
  }

  function addToUsedTracks(srcTrackId: string, newTrackId: string) {
    // console.log()
    // console.log('store.tracks > addToUsedTracks > srcTrackId : ', srcTrackId)
    // console.log('store.tracks > addToUsedTracks > newTrackId : ', newTrackId)

    removeFurtherUsedTracks(srcTrackId)

    // add newTrackId
    const trackInfos: UsedTrack = {
      id: newTrackId,
      completed: false,
      step: usedTracks.value.length + 1,
      values: [],
      next: null,
    }
    // @ts-ignore
    usedTracks.value.push(trackInfos)
  }

  function updateUsedTracks(trackId: string, step: number, option: any, values: any[]) {
    // console.log()
    // console.log('store.tracks > updateUsedTracks > trackId : ', trackId)
    // console.log('store.tracks > updateUsedTracks > step : ', step)
    // console.log('store.tracks > updateUsedTracks > values : ', values)
    usedTracks.value.map((trackInfo: UsedTrack) => {
      if (trackInfo.id === trackId) {
        // console.log('store.tracks > updateUsedTracks > trackInfo : ', trackInfo)
        // console.log('store.tracks > updateUsedTracks > trackInfo : ', trackInfo)
        const hasValues = Boolean(values.length)
        const nextTrack = option.next
        trackInfo.values = values
        trackInfo.completed = hasValues
        trackInfo.next = hasValues ? nextTrack : null
      }
    })
  }

  function removeFurtherUsedTracks(srcTrackId: string) {
    // console.log()
    // console.log('store.tracks > removeFurtherUsedTracks > srcTrackId : ', srcTrackId)
    const lastTrack: UsedTrack | undefined = usedTracks.value.find((t: UsedTrack) => t.id === srcTrackId)
    // @ts-ignore
    const newArray = usedTracks.value.filter((t: UsedTrack) => t.step <= lastTrack?.step)
    usedTracks.value = newArray
  }

  return { 
    maxDepth,
    allTracks,
    tracksStepsArrayDict,
    seedTrack,
    usedTracks,
    tracksStepsArray,
    currentStep,
    setMaxDepth,
    getTrack,
    trackExistsInUsed,
    setSeedTrack,
    addToUsedTracks,
    updateUsedTracks,
    removeFurtherUsedTracks
  }
})
