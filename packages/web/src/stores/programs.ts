import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ProgramData, TrackId, TrackOptions, UsedTrack } from '@/types/index'
import { filterPrograms as filterWithPublicodes } from '@tee/backend/src/domain/eligibility'
import type { QuestionnaireData } from '@tee/backend/src/domain/types'

export const programsStore = defineStore('programs', () => {
  const programs = ref<ProgramData[]>()
  const programDetail = ref<string | number>()
  const programDetailConfig = ref<TrackId>()

  // getters
  const progs = computed<({ index: string } & ProgramData)[]>(() => {
    return programs.value.map((programData: ProgramData, i: number) => {
      return {
        index: i.toString(),
        ...programData
      }
    })
  })

  function filterPrograms(tracksResults: UsedTrack[]) {
    // console.log()
    // console.log('store.programs > filterPrograms > tracksResults : ', tracksResults)

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
    // console.log('store.programs > filterPrograms > conditions :', conditions)

    // filter out programs
    const progsFilteredResult = filterWithPublicodes(progs.value, conditions as QuestionnaireData)

    if (progsFilteredResult.isErr) {
      throw new Error(progsFilteredResult.error.message)
    }

    return progsFilteredResult.value
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
    return progs.value.find((programData: ProgramData) => programData.id === id)
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
