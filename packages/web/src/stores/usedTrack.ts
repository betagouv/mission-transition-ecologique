import { useNavigationStore } from '@/stores/navigation'
import { useTrackStore } from '@/stores/track'
import { TrackComponent, TrackId, type TrackNext, type TrackOptions, type UsedTrack, type UsedTrackValuePair } from '@/types'
import type { QuestionnaireData } from '@tee/backend/build/backend/src/program/domain/types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'

export const useUsedTrackStore = defineStore('usedTrack', () => {
  const current = ref<UsedTrack | undefined>()
  const usedTracks = ref<UsedTrack[]>([])

  const currentId = computed<TrackId | undefined>((): TrackId | undefined => {
    return current.value?.id
  })

  const currentComponent = computed<TrackComponent>(() => {
    return current.value?.component ?? TrackComponent.Buttons
  })

  const currentStep = computed(() => {
    return current.value?.step
  })

  const currentIsCompleted = computed<boolean>(() => {
    return current.value?.completed ?? false
  })

  const currentIsFirst = computed<boolean>(() => {
    return current.value?.id === TrackId.QuestionnaireRoute
  })

  const usedTracksIds = computed(() => {
    const trackIds = usedTracks.value.map((t: UsedTrack) => t.id)
    const lastTrack = trackIds[trackIds.length - 1]
    if (lastTrack !== TrackId.Results) {
      trackIds.push(TrackId.Results)
    }
    return trackIds
  })

  const completedUsedTracks = computed(() => {
    return usedTracks.value.filter((usedTrack: UsedTrack) => usedTrack?.completed).map((usedTrack: UsedTrack) => toRaw(usedTrack))
  })

  const completedUsedTracksValues = computed<(string | number | object)[]>(() => {
    const usedTrackValues = completedUsedTracks.value
      .map((usedTrack: UsedTrack) => {
        const values = usedTrack.selected?.map((s) => s.value)
        return toRaw(values.map((i) => toRaw(i)))
      })
      .filter((i) => i?.length)

    return usedTrackValues.flat(1)
  })

  const usedTracksValuesPairs = computed<UsedTrackValuePair[]>(() => {
    return usedTracks.value.map((usedTrack: UsedTrack) => {
      const values = usedTrack.selected?.map((s) => s.value)
      return {
        currentId: usedTrack.id,
        completed: usedTrack.completed,
        selection: toRaw(values.map((i) => toRaw(i)))
      }
    })
  })

  function setCurrent(track: UsedTrack | undefined) {
    current.value = track
  }

  function setCurrentByTrackId(trackId: TrackId) {
    setCurrent(getUsedTrack(trackId))
  }

  function updateCurrent(selectedOptions: TrackOptions[], next?: TrackNext) {
    if (current.value) {
      const hasValues = Boolean(selectedOptions.length)

      current.value.selected = selectedOptions
      current.value.completed = hasValues
      current.value.next = hasValues ? next : undefined

      replaceUsedTrack(current.value)

      let value = undefined
      if (current.value.selected.length > 1) {
        value = selectedOptions.map((selectedOption) => selectedOption.value as string)
      } else {
        value = selectedOptions.find(Boolean)?.value as string
      }

      if (value) {
        useNavigationStore().updateQuery({ name: current.value.id, value: value })
      }
    }
  }

  function setCurrentToUncompleted() {
    if (current.value) {
      current.value.completed = false
    }
  }

  function getUsedTrack(trackId: TrackId) {
    return usedTracks.value.find((usedTrack) => usedTrack.id === trackId)
  }

  function findIndexOnUsedTracks(trackId: TrackId) {
    return usedTracks.value.findIndex((usedTrack) => usedTrack.id === trackId)
  }

  function hasUsedTrack(trackId: TrackId) {
    return usedTracks.value.find((usedTrack) => usedTrack.id === trackId) !== undefined
  }

  function hasUsedTracks() {
    return usedTracks.value.length > 0
  }

  function removeFurtherUsedTracks(trackId: TrackId) {
    const usedTrack = getUsedTrack(trackId)
    if (usedTrack) {
      usedTracks.value = usedTracks.value.filter((t: UsedTrack) => t.step <= usedTrack?.step)
    }
  }

  function replaceUsedTrack(usedTrack: UsedTrack) {
    const index = findIndexOnUsedTracks(usedTrack.id)
    if (index !== -1) {
      usedTracks.value[index] = usedTrack

      return true
    }

    return false
  }

  function add(currentTrackId: TrackId, nextTrackId: TrackId) {
    removeFurtherUsedTracks(currentTrackId)

    const track = useTrackStore().getTrack(nextTrackId)
    const usedTrack: UsedTrack = {
      id: nextTrackId,
      component: track?.interface?.component ?? TrackComponent.Buttons,
      category: track?.category,
      completed: false,
      step: usedTracks.value.length + 1,
      selected: [],
      next: undefined
    }

    // Check if already exists annd replace it
    if (!replaceUsedTrack(usedTrack)) {
      usedTracks.value.push(usedTrack)
    }

    useTrackStore().setCurrentTrack(track)
    setCurrent(usedTrack)
  }

  function findSelectedValueByTrackIdAndKey(trackId: TrackId, key: string): string | undefined {
    const usedTrack = usedTracks.value.find((usedTrack: UsedTrack) => usedTrack.id === trackId)
    if (usedTrack?.selected) {
      for (const option of usedTrack.selected) {
        if (typeof option.value === 'object' && key in option.value) {
          const value = option.value as Record<string, unknown>
          return value[key] as string
        }
      }
    }
  }

  function getQuestionnaireData(): QuestionnaireData {
    const questionnaireData: { [k: string]: any } = {}
    usedTracks.value.forEach((usedTrack) => {
      usedTrack.selected.forEach((trackOptions: TrackOptions) => {
        const val = trackOptions.value || {}

        Object.entries(val).forEach(([key, value]) => {
          questionnaireData[key] = value as unknown
        })
      })
    })

    return questionnaireData
  }

  function resetUsedTracks() {
    usedTracks.value = []
  }

  return {
    current,
    currentId,
    currentComponent,
    usedTracks,
    usedTracksIds,
    completedUsedTracksValues,
    usedTracksValuesPairs,
    currentIsCompleted,
    setCurrent,
    setCurrentByTrackId,
    updateCurrent,
    setCurrentToUncompleted,
    currentIsFirst,
    getUsedTrack,
    hasUsedTrack,
    hasUsedTracks,
    removeFurtherUsedTracks,
    currentStep,
    replaceUsedTrack,
    add,
    resetUsedTracks,
    findSelectedValueByTrackIdAndKey,
    getQuestionnaireData
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsedTrackStore, import.meta.hot))
}
