import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { ProgramData, Condition } from '@/types/index'

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

  function filterPrograms (tracksResults: any[]) {
    // console.log()
    // console.log('store.programs > filterPrograms > tracksResults : ', tracksResults)

    // retrieve and organize user's conditions
    const conditions: {[k: string]: any} = {}
    tracksResults.map(tr => {
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
    // const conditionsKeys = Object.keys(conditions)
    // console.log()
    // console.log('store.programs > filterPrograms > conditions : ', conditions)
    // console.log('store.programs > filterPrograms > conditionsKeys : ', conditionsKeys)

    // filter out programs
    const progsFiltered = progs.value.filter((prog: any) => {
      const boolArray = [true]

      // TO REWRITE => IMPLEMENT NEW CONDITIONS STRUCTURE W/ OPERATOR
      // retrieve program's conditions
      const progConditionsAlt = prog.conditions
      // console.log('store.programs > filterPrograms > progConditionsAlt : ', progConditionsAlt)
      // loop program conditions keys to set a filter
      progConditionsAlt.forEach((cond: Condition) => {
        const condField: string = cond.type || ''
        const condVal = cond.value
        const userChoice = conditions[condField]
        // console.log()
        // console.log('store.programs > filterPrograms > condField : ', condField)
        // console.log('store.programs > filterPrograms > condVal : ', condVal)
        // console.log('store.programs > filterPrograms > userChoice : ', userChoice)
        let condBool = true
        if (userChoice) {
          switch (cond.operator) {
            case 'or':
              // console.log('store.programs > filterPrograms > cond : ', cond)
              condBool = userChoice.includes('*') || condVal.includes('*')
              if (!condBool) {
                // ... make the intersection between user list of condition and program's conditions
                const intersection = condVal.filter((v: any) => userChoice.includes(v))
                // console.log('store.programs > filterPrograms > intersection : ', intersection)
                condBool = userChoice.includes('*') || intersection.length
              }
          }
        }
        boolArray.push(condBool)
      })

      // by default all of user's conditions must be met
      return boolArray.every(b => !!b)
    }) 
    // console.log('store.programs > filterPrograms > progsFiltered : ', progsFiltered)

    return <ProgramData[]>progsFiltered
  }

  function setYamlDataset (dataset: any) {
    programs.value = dataset
  }

  function setDetailResult (programeId: string | number, detailConfig: any) {
    programDetail.value = programeId
    programDetailConfig.value = detailConfig
  }

  function resetDetailResult () {
    programDetail.value = undefined
    programDetailConfig.value = undefined
  }

  function getProgramById (id: string | number ) {
    const prog = progs.value.find((p: ProgramData) => p.id === id)
    return prog
  }

  return { 
    programs,
    programDetail,
    programDetailConfig,
    progs,
    filterPrograms,
    setYamlDataset,
    setDetailResult,
    resetDetailResult,
    getProgramById
  }
})
