import { ref, computed, toRaw } from 'vue'
// cf : https://stackoverflow.com/questions/64917686/vue-array-converted-to-proxy-object
import { defineStore } from 'pinia'

import { tracks } from '../questionnaire'

// @ts-ignore
import type { Track, Translations, UsedTrack } from '@/types/index'

const allTracks = ref(tracks)
const seedTrack = ref()

export const tracksStore = defineStore('tracks', () => {
  // console.log('store.tracks > defineStore > tracks : ', tracks)
  
  const trackResultString = 'track_results'
  
  const maxDepth = ref(4)

  const usedTracks = ref<UsedTrack[]>([])

  // computed
  const tracksStepsArrayDict = computed(() => {
    const dict = allTracks.value.map((track: any) => {
      return {
        id: track.id,
        label: track.label
      }
    })
    return dict
  })
  const tracksStepsArray = computed(() => {
    const tracksArray = usedTracks.value.map((t: UsedTrack) => t.id)
    const lastTrack = tracksArray[tracksArray.length - 1]
    if (lastTrack !== trackResultString) {
      tracksArray.push(trackResultString)
    }
    return tracksArray
  })
  const currentStep = computed(() => {
    const tracksArray = usedTracks.value.slice(-1)
    const track: UsedTrack = tracksArray[0]
    const stepNumber = track.step
    return stepNumber
  })
  const tracksResults = computed(() => {
    let results = usedTracks.value
      .filter(track => track.id !== trackResultString)
      .map(track => {
        return {
          id: track.id,
          step: track.step,
          values: track.values,
          // val: track.val,
          data: track.data
        }
      })
    if (!results.length) { results = [] } 
    return results
  })
  const getAllUsedTracks = computed(() => {
    const res = usedTracks.value
      .filter((i: UsedTrack) => i?.completed)
      .map((i: UsedTrack) => toRaw(i))
    return res
  })

  // getters
  function getTrack(trackId: string) {
    const track = allTracks.value.find(track => track.id === trackId)
    return track
  }
  const getTrackTitle = (trackId: string, lang: string) => {
    const track = getTrack(trackId)
    // @ts-ignore
    const trackTitle: Translations = track?.title
    const titleString: string = trackTitle && trackTitle[lang]
    return titleString
  }
  function trackExistsInUsed(trackId: string) {
    // @ts-ignore
    const exists = usedTracks.value.find(t => t.id === trackId)
    return !!exists
  }
  const isTrackCompleted = (trackId: string) => {
    const track = usedTracks.value.find(t => t.id === trackId)
    // @ts-ignore
    return track?.completed
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
    console.log()
    console.log('store.tracks > addToUsedTracks > srcTrackId : ', srcTrackId)
    console.log('store.tracks > addToUsedTracks > newTrackId : ', newTrackId)

    removeFurtherUsedTracks(srcTrackId)

    // add newTrackId
    const trackInfos: UsedTrack = {
      id: newTrackId,
      completed: false,
      updating: false,
      step: usedTracks.value.length + 1,
      values: [],
      // val: [],
      data: {},
      next: null,
    }
    // @ts-ignore
    usedTracks.value.push(trackInfos)
  }

  function updateUsedTracks(trackId: string, step: number, option: any, values: any[], data: object) {
    console.log()
    console.log('store.tracks > updateUsedTracks > trackId : ', trackId)
    console.log('store.tracks > updateUsedTracks > step : ', step)
    console.log('store.tracks > updateUsedTracks > values : ', values)
    usedTracks.value.map((trackInfo: UsedTrack) => {
      if (trackInfo.id === trackId) {
        // console.log('store.tracks > updateUsedTracks > trackInfo : ', trackInfo)
        // console.log('store.tracks > updateUsedTracks > trackInfo : ', trackInfo)
        const hasValues = Boolean(values.length)
        const nextTrack = option.next
        trackInfo.values = values
        // trackInfo.val = val
        trackInfo.completed = !!values.length
        trackInfo.data = data
        trackInfo.completed = hasValues
        trackInfo.next = hasValues ? nextTrack : null
      }
    })
  }

  function setUsedTracksAsNotCompleted(trackId: string) {
    console.log()
    console.log('store.tracks > setUsedTracksAsNotCompleted > trackId : ', trackId)
    usedTracks.value.map((trackInfo: UsedTrack) => {
      if (trackInfo.id === trackId) {
        trackInfo.completed = false
      }
    })
  }

  function removeFurtherUsedTracks(srcTrackId: string) {
    console.log()
    console.log('store.tracks > removeFurtherUsedTracks > srcTrackId : ', srcTrackId)
    const lastTrack: UsedTrack | undefined = usedTracks.value.find((t: UsedTrack) => t.id === srcTrackId)
    console.log('store.tracks > removeFurtherUsedTracks > lastTrack : ', lastTrack)
    // @ts-ignore
    const newArray = usedTracks.value.filter((t: UsedTrack) => t.step <= lastTrack?.step)
    console.log('store.tracks > removeFurtherUsedTracks > newArray : ', newArray)
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
    tracksResults,
    setMaxDepth,
    getTrack,
    getTrackTitle,
    isTrackCompleted,
    getAllUsedTracks,
    trackExistsInUsed,
    setSeedTrack,
    addToUsedTracks,
    updateUsedTracks,
    setUsedTracksAsNotCompleted,
    removeFurtherUsedTracks
  }
})
