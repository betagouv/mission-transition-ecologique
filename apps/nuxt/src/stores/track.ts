// CONSOLE LOG TEMPLATE
// console.log(`store.tracks > FUNCTION_NAME > MSG_OR_VALUE :`)

import { tracks as allTracks } from '@/questionnaire'
import { type Track, TrackComponent, type TrackOptionsUnion, type Translations } from '@/types'
import { TrackId } from '@/types'
import TrackSiret from '@/tools/track/TrackSiret'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTrackStore = defineStore('track', () => {
  const tracks = ref<Track[]>(allTracks)
  const current = ref<Track | undefined>()
  const maxDepth = ref(4)

  const currentId = computed<TrackId | undefined>(() => {
    return current.value?.id
  })

  const currentOptions = computed<TrackOptionsUnion[]>(() => {
    return current.value?.options?.filter((o): o is TrackOptionsUnion => !o.disabled) ?? []
  })

  const currentComponent = computed<TrackComponent>(() => {
    return current.value?.interface?.component ?? TrackComponent.Buttons
  })

  const currentColumnWidth = computed<number | string>(() => {
    return current.value?.interface?.columnWidth ?? 0
  })

  const tracksStepsArrayDict = computed(() => {
    return tracks.value.map((track: Track) => {
      return {
        id: track.id,
        label: track.label
      }
    })
  })

  const getTrack = (trackId: TrackId): Track | undefined => {
    return tracks.value.find((track) => track.id === trackId)
  }

  const getTrackTitle = (trackId: TrackId, lang: string): string | undefined => {
    const track = getTrack(trackId)
    const trackTitle: Translations | undefined = track?.title
    return trackTitle?.[lang]
  }

  // actions
  function setMaxDepth(depth: number) {
    maxDepth.value = depth
  }

  function setCurrentTrack(currentTrack: Track | undefined) {
    current.value = currentTrack
  }

  function setCurrentTrackById(trackId: TrackId) {
    setCurrentTrack(getTrack(trackId))
  }

  async function getSelectedOptionsByTrackAndValue(track: Track, value: string | string[]): Promise<TrackOptionsUnion[]> {
    let selectedOptions: TrackOptionsUnion[] = []
    let selectedOption: TrackOptionsUnion | undefined = undefined
    if (track.id === TrackId.Siret && !Array.isArray(value)) {
      selectedOption = await TrackSiret.getOptionBySiret(track, value)
    } else {
      if (Array.isArray(value)) {
        selectedOptions = value
          .map((value) => track.options?.find((option) => option.value === value) as TrackOptionsUnion)
          .filter((trackOption: TrackOptionsUnion | undefined) => {
            return trackOption !== undefined
          }) as TrackOptionsUnion[]
      } else {
        selectedOption = track.options?.find((option) => option.value === value)
      }
    }

    if (selectedOption) {
      selectedOptions = [selectedOption]
    }

    return selectedOptions
  }

  return {
    tracks,
    maxDepth,
    current,
    currentId,
    currentComponent,
    currentOptions,
    currentColumnWidth,
    tracksStepsArrayDict,
    setMaxDepth,
    getTrack,
    getTrackTitle,
    setCurrentTrack,
    setCurrentTrackById,
    getSelectedOptionsByTrackAndValue
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTrackStore, import.meta.hot))
}
