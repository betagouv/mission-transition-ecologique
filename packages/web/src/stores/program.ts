// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import { useUsedTrackStore } from '@/stores/usedTrack'
import ProgramFilter from '@/utils/program/programFilters'
import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import jsonDataset from '../../public/data/generated/dataset_out.json'

import { type ProgramData, type QuestionnaireRoute, type programFiltersType, ProgramAidType, Objectives } from '@/types'
import { filterPrograms as filterWithPublicodes, sortPrograms } from '@tee/backend/src/program/application/sortAndFilterPrograms'
import type { QuestionnaireData } from '@tee/backend/src/program/domain/types'

export const useProgramStore = defineStore('program', () => {
  const programsJson = ref<ProgramData[]>(jsonDataset as ProgramData[])
  const programDetail = ref<string | number>()

  const programFilters = ref<programFiltersType>({
    programAidTypeSelected: '',
    objectifTypeSelected: ''
  })

  const programs = computed<ProgramData[]>(() => {
    return getPrograms()
  })

  const programsByUsedTracks = computed<ProgramData[]>(() => {
    // filter out programs
    return getPrograms(useUsedTrackStore().getQuestionnaireData())
  })

  function getPrograms(questionnaireData: QuestionnaireData = {}) {
    if (programsJson.value.length > 0) {
      const programsFilteredResult = filterWithPublicodes(programsJson.value, questionnaireData)

      if (programsFilteredResult.isErr) {
        throw new Error(programsFilteredResult.error.message)
      }

      return sortPrograms(programsFilteredResult.value, questionnaireData['questionnaire_route'] as QuestionnaireRoute)
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

  function getProgramById(id: string | number) {
    return programs.value?.find((programData: ProgramData) => programData.id === id)
  }

  function hasProgramById(id: string | number) {
    return programs.value?.some((programData: ProgramData) => programData.id === id)
  }

  return {
    programs,
    programDetail,
    programFilters,
    programsByUsedTracks,
    getProgramsByFilters,
    getProgramById,
    hasProgramById
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramStore, import.meta.hot))
}
