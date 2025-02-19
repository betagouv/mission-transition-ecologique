import { useNavigationStore } from '@/stores/navigation'
import { useTrackStore } from '@/stores/track'
import Navigation from '@/tools/navigation'
import {
  CompanyDataStorageKey,
  EstablishmentFront,
  LegalCategory,
  type NextTrackRuleSet,
  type QuestionnaireData,
  StructureSize,
  type Track,
  TrackComponent,
  TrackId,
  type TrackNext,
  type TrackOptions,
  type TrackOptionsUnion,
  type UsedTrack,
  type UsedTrackValuePair
} from '@/types'
import { CheckNextTrackRules } from '@/tools/conditions'
import { remapItem } from '@/tools/helpers'
import Translation from '@/tools/translation'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'
import { CompanyData } from '@/tools/companyData'
import TrackSiret from '@/tools/questionnaire/track/TrackSiret'

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

  const usedTracksIds = computed<TrackId[]>(() => {
    return usedTracks.value.map((usedTrack: UsedTrack) => usedTrack.id)
  })

  const completedUsedTracks = computed(() => {
    return usedTracks.value.filter((usedTrack: UsedTrack) => usedTrack?.completed).map((usedTrack: UsedTrack) => toRaw(usedTrack))
  })

  const completedUsedTracksIds = computed(() => {
    return usedTracks.value.filter((usedTrack: UsedTrack) => usedTrack?.completed).map((usedTrack: UsedTrack) => usedTrack.id)
  })

  const completedQuestionnaireData = computed<(string | number | object | undefined)[]>(() => {
    const data = completedUsedTracks.value
      .map((usedTrack: UsedTrack) => {
        return usedTrack.selected?.map((optionSelected) => toRaw(optionSelected.questionnaireData))
      })
      .filter((questionnaireDatum) => questionnaireDatum?.length)
      .flat(1)

    CompanyData.populateCompletedQuestionnaire(data)

    return data
  })

  const usedTracksValuesPairs = computed<UsedTrackValuePair[]>(() => {
    return usedTracks.value.map((usedTrack: UsedTrack) => {
      const values = usedTrack.selected?.map((s: TrackOptionsUnion) => s.value)
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

  function setCurrentSelectedOptions(selectedOptions: TrackOptions[]) {
    if (current.value) {
      current.value.selected = selectedOptions
    }
  }

  function updateCurrent(selectedOptions: TrackOptions[]) {
    if (current.value) {
      current.value.selected = selectedOptions
      current.value.completed = Boolean(selectedOptions.length)
      current.value.next = getNextFromCurrent()

      replaceUsedTrack(current.value)

      let value = undefined
      if (current.value.selected.length > 1) {
        value = selectedOptions.map((selectedOption) => selectedOption.value as string)
      } else {
        value = selectedOptions.find(Boolean)?.value as string
      }

      if (value) {
        useNavigationStore().updateSearchParam({ name: current.value.id, value: value })

        CompanyData.setDataStorageFromTrack(current.value.id, value, selectedOptions)
      }
    }

    CompanyData.updateSearchParamFromStorage()
  }

  function getNextFromCurrent() {
    if (!current.value?.completed) {
      return undefined
    }

    const optionNext = current.value?.selected[0].next
    const nextTrackRulesSet = optionNext?.ruleSet
    const defaultNext = useTrackStore().current?.next
    let next = !optionNext || !!useTrackStore().current?.behavior?.multipleChoices ? defaultNext : optionNext
    if (nextTrackRulesSet) {
      // get current selection
      const selectedQuestionnaireData = current.value?.selected.map((item) => {
        return toRaw(item.questionnaireData)
      })
      nextTrackRulesSet.forEach((trackRule: NextTrackRuleSet) => {
        const item = remapItem(
          {},
          trackRule.rules,
          {},
          completedQuestionnaireData.value,
          {},
          {},
          selectedQuestionnaireData,
          Translation.lang
        )
        const bool = CheckNextTrackRules(item, trackRule.rules)
        next = bool ? trackRule.next : next
      })
    }
    return next
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

  function getPreviousCompletedUsedTrackId() {
    return completedUsedTracksIds.value.slice(-1).reverse().pop()
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
    if (nextTrackId === TrackId.Goals || nextTrackId === TrackId.BuildingProperty) {
      setFromStorage()
    }

    if (track) {
      const usedTrack = createOrUpdateUsedTrack(track)

      useTrackStore().setCurrentTrack(track)
      setCurrent(usedTrack)
    }
  }

  function createOrUpdateUsedTrack(track: Track, selectedOptions: TrackOptions[] = [], next?: TrackNext) {
    const usedTrack: UsedTrack = {
      id: track.id,
      component: track.interface?.component ?? TrackComponent.Buttons,
      category: track.category,
      completed: Boolean(selectedOptions.length),
      step: usedTracks.value.length + 1,
      selected: selectedOptions,
      next: next
    }

    // Check if already exists and replace it
    if (!replaceUsedTrack(usedTrack)) {
      usedTracks.value.push(usedTrack)
    }

    return usedTrack
  }

  async function updateByTrackIdAndValue(trackId: TrackId, value: string | string[]) {
    const track = useTrackStore().getTrack(trackId)
    if (track) {
      const selectedOptions = await useTrackStore().getSelectedOptionsByTrackAndValue(track, value)
      if (selectedOptions.length > 0) {
        createOrUpdateUsedTrack(track, selectedOptions)
        useNavigationStore().updateSearchParam({ name: trackId, value: value })
      }
    }
  }

  function findInQuestionnaireDataByTrackIdAndKey(trackId: TrackId, key: string): string | undefined {
    const usedTrack = usedTracks.value.find((usedTrack: UsedTrack) => usedTrack.id === trackId)
    if (usedTrack?.selected) {
      for (const option of usedTrack.selected) {
        if (option && option.questionnaireData && key in option.questionnaireData) {
          const questionnaireData = option.questionnaireData as Record<string, unknown>
          return questionnaireData[key] as string
        }
      }
    }
  }

  function getQuestionnaireData(): QuestionnaireData {
    const questionnaireData: { [k: string]: any } = {}
    usedTracks.value.forEach((usedTrack) => {
      usedTrack.selected.forEach((trackOptions: TrackOptions) => {
        const questionnaireDatum = trackOptions.questionnaireData || {}

        Object.entries(questionnaireDatum).forEach(([key, value]) => {
          questionnaireData[key] = value as unknown
        })

        if (usedTrack.id === TrackId.Siret && questionnaireDatum.legalCategory === LegalCategory.EI) {
          questionnaireData.structure_size = StructureSize.EI
        }
      })
    })
    const navigation = Navigation.getInstance()
    if (!navigation.isCatalog() && !navigation.isCatalogProgramDetail() && !navigation.isHomepage()) {
      questionnaireData.onlyEligible = true
    } else if (navigation.isCatalogPrograms()) {
      questionnaireData.onlyEligible = false
    }

    CompanyData.populateQuestionnaireData(questionnaireData)

    return questionnaireData
  }

  function setFromStorage() {
    for (const [companyDataStorageKey, value] of Object.entries(CompanyData.dataRef.value)) {
      if (value) {
        let selectedOption = undefined
        const trackId = CompanyData.getTrackIdFromStorageKey(companyDataStorageKey as CompanyDataStorageKey)
        const track = useTrackStore().getTrack(trackId)

        if (track === undefined) {
          useNavigationStore().deleteSearchParam(trackId)
          continue
        }

        if (companyDataStorageKey === CompanyDataStorageKey.Company) {
          selectedOption = TrackSiret.createData(
            track.options?.find(() => true) as TrackOptionsUnion,
            (value as EstablishmentFront).siret,
            value as EstablishmentFront
          ).option
        }

        createOrUpdateUsedTrack(track, [selectedOption ?? value] as unknown as TrackOptionsUnion[])
      }
    }
  }

  async function setFromNavigation() {
    for (const trackId of Object.keys(useNavigationStore().query)) {
      const track = useTrackStore().getTrack(trackId as TrackId)

      if (track === undefined) {
        useNavigationStore().deleteSearchParam(trackId)
        return
      }

      const value = useNavigationStore().query[trackId] as string | string[]
      const selectedOptions: TrackOptionsUnion[] = await useTrackStore().getSelectedOptionsByTrackAndValue(track, value)

      CompanyData.setDataStorageFromTrack(trackId as TrackId, value, selectedOptions)

      if (selectedOptions.length === 0) {
        useNavigationStore().deleteSearchParam(trackId)
        continue
      }

      createOrUpdateUsedTrack(track, selectedOptions)
    }
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
    completedQuestionnaireData,
    usedTracksValuesPairs,
    currentIsCompleted,
    setCurrentSelectedOptions,
    updateCurrent,
    setCurrentToUncompleted,
    getUsedTrack,
    getPreviousCompletedUsedTrackId,
    hasUsedTrack,
    hasUsedTracks,
    removeFurtherUsedTracks,
    currentStep,
    updateByTrackIdAndValue,
    add,
    resetUsedTracks,
    findInQuestionnaireDataByTrackIdAndKey,
    getQuestionnaireData,
    setFromNavigation,
    setFromStorage
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsedTrackStore, import.meta.hot))
}
