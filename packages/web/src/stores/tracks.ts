// import Vue from 'vue'
import { ref, shallowRef, computed, toRaw } from 'vue'
// cf : https://stackoverflow.com/questions/64917686/vue-array-converted-to-proxy-object
import { defineStore } from 'pinia'

import { tracks } from '../questionnaire'

// @ts-ignore
import type { Translations, UsedTrack } from '@/types/index'
import { TrackComponents } from '@/types/index'

const allTracks = ref(tracks)
const seedTrack = ref()

export const tracksStore = defineStore('tracks', () => {
  // console.log('store.tracks > defineStore > tracks : ', tracks)
  
  const trackResultString = 'track_results'
  
  const maxDepth = ref(4)

  const usedTracks = shallowRef<UsedTrack[]>([])

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
  const getLastTrack = computed(() => {
    const tracksArray = usedTracks.value.slice(-1)
    const track: UsedTrack = tracksArray[0]
    return track
  })
  const currentTrackId = computed(() => {
    const tracksArray = usedTracks.value.slice(-1)
    const track: UsedTrack = tracksArray[0]
    const stepNumber = track?.id
    return stepNumber
  })
  const currentStep = computed(() => {
    const track: UsedTrack = getLastTrack.value
    const stepNumber = track?.step
    return stepNumber
  })
  const getAllUsedTracks = computed(() => {
    const res = usedTracks.value
      .filter((i: UsedTrack) => i?.completed)
      .map((i: UsedTrack) => toRaw(i))
    return res
  })
  const getAllUsedTracksValues = computed(() => {
    const usedTrackValues = getAllUsedTracks.value.map((usedTrack: UsedTrack) => {
      const values = usedTrack.selected?.map((s) => s.value)
      return toRaw(values.map((i) => toRaw(i)))
    }).filter((i) => i?.length)
    // console.log('store.tracks > getAllUsedTracksValues >  usedTrackValues :', usedTrackValues)

    const trackValues: any[] = usedTrackValues.flat(1)
    return trackValues
  })
  const getAllUsedTracksValuesPairs = computed(() => {
    const usedTrackValues = usedTracks.value.map((usedTrack: UsedTrack) => {
      const values = usedTrack.selected?.map((s) => s.value)
      return {
        trackId: usedTrack.id,
        completed: usedTrack.completed,
        selection: toRaw(values.map((i) => toRaw(i)))
      }
    })
    // console.log('store.tracks > getAllUsedTracksValues >  usedTrackValues :', usedTrackValues)

    return usedTrackValues
  })

  // getters
  const getTrack = (trackId: string) => {
    const track = allTracks.value.find(track => track.id === trackId)
    return track
  }
  const getTrackCategory = (trackId: string) => {
    const track = getTrack(trackId)
    // @ts-ignore
    const trackCateg: string = track?.category
    return trackCateg
  }
  const getTrackTitle = (trackId: string, lang: string) => {
    const track = getTrack(trackId)
    // @ts-ignore
    const trackTitle: Translations = track?.title
    const titleString: string = trackTitle && trackTitle[lang]
    return titleString
  }
  const getTrackLabel = (trackId: string, lang: string) => {
    const track = getTrack(trackId)
    // @ts-ignore
    const trackTitle: Translations = track?.label
    const titleString: string = trackTitle && trackTitle[lang]
    return titleString
  }
  const getTrackBgColor = (trackId: string) => {
    const track = getTrack(trackId)
    // @ts-ignore
    const trackBgColor: string = track?.bgColor
    return trackBgColor
  }
  const getTrackImageRight = (trackId: string) => {
    const track = getTrack(trackId)
    // @ts-ignore
    const trackImageRight: string = track?.imageRight
    return trackImageRight
  }
  function trackExistsInUsed(trackId: string) {
    // @ts-ignore
    const exists = usedTracks.value.find(t => t.id === trackId)
    return !!exists
  }
  const isTrackCompleted = (trackId: string) => {
    const track = usedTracks.value.find(t => t.id === trackId)
    return track?.completed
  }

  // actions
  function setMaxDepth(depth: number) { 
    maxDepth.value = depth
  }

  async function setSeedTrack(seed: string) {
    // console.log()
    // console.log('store.tracks > setSeedTrack > seed : ', seed)
    const track = getTrack(seed)
    // console.log('store.tracks > setSeedTrack > track : ', track)
    seedTrack.value = track?.id
  }

  function addToUsedTracks(srcTrackId: string, newTrackId: string) {
    // console.log()
    // console.log('store.tracks > addToUsedTracks > srcTrackId : ', srcTrackId)
    // console.log('store.tracks > addToUsedTracks > newTrackId : ', newTrackId)

    // const srcTrack = getTrack(srcTrackId)
    // console.log('store.tracks > addToUsedTracks > srcTrack : ', srcTrack)
    const nextTrack = getTrack(newTrackId)
    // console.log('store.tracks > addToUsedTracks > nextTrack : ', nextTrack)

    removeFurtherUsedTracks(srcTrackId)

    // add newTrackId
    const trackInfos: UsedTrack = {
      id: newTrackId,
      component: nextTrack?.interface.component || TrackComponents.buttons,
      category: nextTrack?.category,
      completed: false,
      step: usedTracks.value.length + 1,
      selected: [],
      next: null,
    }
    // console.log('store.tracks > addToUsedTracks > trackInfos : ', trackInfos)
    // @ts-ignore
    usedTracks.value.push(trackInfos)
  }

  function updateUsedTracks(trackId: string, step: number, next: any, selectedOptions: any[]) {
    // console.log()
    // console.log('store.tracks > updateUsedTracks > trackId : ', trackId)
    // console.log('store.tracks > updateUsedTracks > step : ', step)
    // console.log('store.tracks > updateUsedTracks > next : ', next)
    // console.log('store.tracks > updateUsedTracks > selectedOptions : ', selectedOptions)
    usedTracks.value.map((trackInfo: UsedTrack) => {
      if (trackInfo.id === trackId) {
        // console.log('store.tracks > updateUsedTracks > trackInfo (A) : ', trackInfo)
        const hasValues = Boolean(selectedOptions.length)
        const nextTrack = next
        trackInfo.selected = selectedOptions
        trackInfo.completed = hasValues
        trackInfo.next = hasValues ? nextTrack : null
        // console.log('store.tracks > updateUsedTracks > trackInfo (B) : ', trackInfo)
      }
    })
  }

  async function setUsedTracksAsNotCompleted(trackId: string) {
    // console.log()
    // console.log('store.tracks > setUsedTracksAsNotCompleted > trackId : ', trackId)
    // console.log('store.tracks > setUsedTracksAsNotCompleted > updatedArray : ', updatedArray)
    usedTracks.value.map((trackInfo: UsedTrack) => {
      // console.log('store.tracks > setUsedTracksAsNotCompleted > trackInfoCopy : ', trackInfoCopy)
      if (trackInfo.id === trackId) {
        trackInfo.completed = false
        // console.log('store.tracks > setUsedTracksAsNotCompleted > trackInfo : ', trackInfo)
      }
      return trackInfo
    })
    // console.log('store.tracks > setUsedTracksAsNotCompleted > usedTracks.value : ', usedTracks.value)
  }

  async function removeFurtherUsedTracks(srcTrackId: string) {
    // console.log()
    // console.log('store.tracks > removeFurtherUsedTracks > srcTrackId : ', srcTrackId)
    const lastTrack: UsedTrack | undefined = usedTracks.value.find((t: UsedTrack) => t.id === srcTrackId)
    // console.log('store.tracks > removeFurtherUsedTracks > lastTrack : ', lastTrack)
    // @ts-ignore
    const newArray = usedTracks.value.filter((t: UsedTrack) => t.step <= lastTrack?.step)
    // console.log('store.tracks > removeFurtherUsedTracks > newArray : ', newArray)
    usedTracks.value = newArray
  }

  async function resetUsedTracks() {
    usedTracks.value = []
  }

  return { 
    maxDepth,
    allTracks,
    tracksStepsArrayDict,
    seedTrack,
    usedTracks,
    tracksStepsArray,
    getLastTrack,
    currentTrackId,
    currentStep,
    setMaxDepth,
    getTrack,
    getTrackCategory,
    getTrackTitle,
    getTrackLabel,
    getTrackBgColor,
    getTrackImageRight,
    isTrackCompleted,
    getAllUsedTracks,
    getAllUsedTracksValues,
    getAllUsedTracksValuesPairs,
    trackExistsInUsed,
    setSeedTrack,
    addToUsedTracks,
    updateUsedTracks,
    setUsedTracksAsNotCompleted,
    removeFurtherUsedTracks,
    resetUsedTracks
  }
})
