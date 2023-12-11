// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { ProgramData, TrackId } from '@/types/index'
import { filterPrograms as filterWithPublicodes } from '@tee/backend/src/domain/filter-programs'
import { sortPrograms } from '@tee/backend/src/domain/sort-programs'
import type { QuestionnaireData } from '@tee/backend/src/domain/types'

export const programsStore = defineStore('programs', () => {
  const programs = ref()
  const programDetail = ref<string | number>()
  const programDetailConfig = ref<TrackId>()

  // getters
  const progs = computed(() => {
    const progsIndexed = programs.value.map((p: object | any, i: number) => {
      return {
        index: i.toString(),
        ...p
      }
    })
    return progsIndexed
  })

  function filterPrograms(tracksResults: any[]) {
    // retrieve and organize user's conditions
    const conditions: { [k: string]: any } = {}
    tracksResults.map((tr) => {
      tr.selected.map((v: object) => {
        // @ts-ignore
        const val = v.value || {}
        for (const [key, value] of Object.entries(val)) {
          conditions[key] = value
        }
      })
    })

    // filter out programs
    const progsFilteredResult = filterWithPublicodes(
      progs.value as ProgramData[],
      conditions as QuestionnaireData
    )

    if (progsFilteredResult.isErr) {
      throw new Error(progsFilteredResult.error.message)
    }

    const sortedPrograms = sortPrograms(progsFilteredResult.value, conditions['user_help'])

    return sortedPrograms
  }

  function setDataset(dataset: any) {
    programs.value = dataset
  }

  function setDetailResult(programeId: string | number, detailConfig: TrackId) {
    programDetail.value = programeId
    programDetailConfig.value = detailConfig
  }

  function resetDetailResult() {
    programDetail.value = undefined
    programDetailConfig.value = undefined
  }

  function getProgramById(id: string | number) {
    const prog = progs.value.find((p: ProgramData) => p.id === id)
    return prog
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
