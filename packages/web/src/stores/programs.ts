// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ProgramData, TrackId, TrackOptions, UsedTrack } from '@/types/index'
import { filterPrograms as filterWithPublicodes, sortPrograms } from '@tee/backend/src/program/application/sortAndFilterPrograms'
import type { QuestionnaireData } from '@tee/backend/src/program/domain/types'
import { QuestionnaireRoute } from '@tee/common/src/questionnaire/types'

export const programsStore = defineStore('programs', () => {
  const programs = ref<ProgramData[]>()
  const programDetail = ref<string | number>()
  const programDetailConfig = ref<TrackId>()

  // getters
  const progs = computed<({ index: string } & ProgramData)[] | undefined>(() => {
    return programs.value?.map((programData: ProgramData, i: number) => {
      return {
        index: i.toString(),
        ...programData
      }
    })
  })

  function filterPrograms(tracksResults: UsedTrack[]) {
    // retrieve and organize user's conditions
    const conditions: { [k: string]: any } = {}
    tracksResults.forEach((trackResult) => {
      trackResult.selected.forEach((trackOptions: TrackOptions) => {
        const val = trackOptions.value || {}

        Object.entries(val).forEach(([key, value]) => {
          conditions[key] = value as unknown
        })
      })
    })

    // filter out programs
    if (progs.value) {
      const progsFilteredResult = filterWithPublicodes(progs.value, conditions as QuestionnaireData)

      if (progsFilteredResult.isErr) {
        throw new Error(progsFilteredResult.error.message)
      }

      return sortPrograms(progsFilteredResult.value, conditions['questionnaire_route'] as QuestionnaireRoute)
    }
  }

  function setDataset(dataset: ProgramData[]) {
    programs.value = dataset
  }

  function setDetailResult(programId: string | number, detailConfig: TrackId) {
    programDetail.value = programId
    programDetailConfig.value = detailConfig
  }

  function resetDetailResult() {
    programDetail.value = undefined
    programDetailConfig.value = undefined
  }

  function getProgramById(id: string | number) {
    return progs.value?.find((programData: ProgramData) => programData.id === id)
  }

  return {
    programs,
    programDetail,
    programDetailConfig,
    progs,
    filterPrograms,
    setDataset,
    setDetailResult,
    resetDetailResult,
    getProgramById
  }
})
