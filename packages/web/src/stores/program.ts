// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import { useUsedTrackStore } from '@/stores/usedTrack'
import ProgramFilter from '@/utils/program/programFilters'
import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'

import { type ProgramData, type TrackOptions, type QuestionnaireRoute, type programFiltersType, ProgramAidType, Objectives } from '@/types'
import { filterPrograms as filterWithPublicodes, sortPrograms } from '@tee/backend/src/program/application/sortAndFilterPrograms'
import type { QuestionnaireData } from '@tee/backend/src/program/domain/types'

export const useProgramStore = defineStore('program', () => {
  const programs = ref<ProgramData[]>([])
  const programDetail = ref<string | number>()

  const programFilters = ref<programFiltersType>({
    programAidTypeSelected: '',
    objectifTypeSelected: ''
  })

  // getters
  const progs = computed<({ index: string } & ProgramData)[]>(() => {
    return programs.value?.map((programData: ProgramData, i: number) => {
      return {
        index: i.toString(),
        ...programData
      }
    })
  })

  function getProgramsByUsedTracks() {
    const usedTracks = useUsedTrackStore().usedTracks
    // retrieve and organize user's conditions
    const conditions: { [k: string]: any } = {}
    usedTracks.forEach((usedTrack) => {
      usedTrack.selected.forEach((trackOptions: TrackOptions) => {
        const val = trackOptions.value || {}

        Object.entries(val).forEach(([key, value]) => {
          conditions[key] = value as unknown
        })
      })
    })

    // filter out programs
    if (progs.value.length > 0) {
      const progsFilteredResult = filterWithPublicodes(progs.value, conditions as QuestionnaireData)

      if (progsFilteredResult.isErr) {
        throw new Error(progsFilteredResult.error.message)
      }

      return sortPrograms(progsFilteredResult.value, conditions['questionnaire_route'] as QuestionnaireRoute)
    }

    return []
  }

  function getProgramsByFilters(programs: ProgramData[]) {
    return programs.filter((program: ProgramData) => {
      return (
        ProgramFilter.filterProgramsByAidType(program, programFilters.value.programAidTypeSelected as ProgramAidType) &&
        ProgramFilter.filterProgramsByObjective(program, programFilters.value.objectifTypeSelected as Objectives)
      )
    })
  }

  function setDataset(dataset: ProgramData[]) {
    programs.value = dataset
  }

  function getProgramById(id: string | number) {
    return progs.value?.find((programData: ProgramData) => programData.id === id)
  }

  return {
    programs,
    programDetail,
    progs,
    programFilters,
    getProgramsByUsedTracks,
    getProgramsByFilters,
    setDataset,
    getProgramById
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramStore, import.meta.hot))
}
