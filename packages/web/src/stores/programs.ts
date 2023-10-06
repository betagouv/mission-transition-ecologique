import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { ProgramData } from '@/types/index'
// import { CheckConditions } from '../utils/conditions'
import { filterPrograms as filterWithPublicodes } from '@tee/backend/src/domain/eligibility'

export const programsStore = defineStore('programs', () => {
  const programs = ref()
  const programDetail = ref<string | number>()
  const programDetailConfig = ref()

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
    // console.log()
    // console.log('store.programs > filterPrograms > tracksResults : ', tracksResults)

    // retrieve and organize user's conditions
    const conditions: { [k: string]: any } = {}
    tracksResults.map((tr) => {
      tr.selected.map((v: object) => {
        // @ts-ignore
        const val = v.value || {}
        // console.log('store.programs > filterPrograms > val : ', val)
        for (const [key, value] of Object.entries(val)) {
          // console.log(`store.programs > filterPrograms > key : ${key} / value : ${value}`)
          conditions[key] = value
        }
      })
    })
    // console.log('store.programs > filterPrograms > conditions :', conditions)

    // filter out programs
    const progsFilteredResult = filterWithPublicodes(progs.value as ProgramData[], conditions)

    if (progsFilteredResult.isErr) {
      throw new Error(progsFilteredResult.error.message)
    }

    // progsFilteredResult = progsFilteredResult.value.filter((prog: any) => {
    //   // const boolArray = [true]

    //   // TO REWRITE => IMPLEMENT NEW CONDITIONS STRUCTURE W/ OPERATOR
    //   // retrieve program's conditions
    //   const progConditionsAlt = prog.conditions

    //   // Using refactorized function
    //   const bool = CheckConditions(conditions, progConditionsAlt)
    //   return bool
    // })

    return progsFilteredResult
  }

  function setDataset(dataset: any) {
    programs.value = dataset
  }

  function setDetailResult(programeId: string | number, detailConfig: any) {
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
