// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ProgramData, TrackId, TrackOptions, UsedTrack } from '@/types/index'
import type { QuestionnaireData } from '@tee/backend/src/program/domain/types'
import { TrackHelpValue } from '@/types/index'

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

  async function filterPrograms(tracksResults: UsedTrack[]) {
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

    // get filtered programs
    const progsFilteredResult = await fetchFilteredPrograms(conditions)
    return progsFilteredResult
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

async function fetchFilteredPrograms(questionnaireData: QuestionnaireData): Promise<ProgramData[]> {
  const url = ''
  const response = await fetch(url, {
    method: 'GET',
    body: JSON.stringify(questionnaireData)
  })
  const programs = await response.json()
  return programs as ProgramData[]
}
