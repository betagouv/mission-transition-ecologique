import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { ProgramData, Condition } from '@/types/index'

/* 
// TO DO ...

// Parse data folder to build list of programs
// Each program must must written as a distinct yaml file
// cf : https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object

*/ 

export const programsStore = defineStore('programs', () => {

  const programs = ref()

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
    tracksResults.forEach(tr => {
      tr.values.forEach((v: string) => {
        const vAsArr = v.split('.')
        const k = vAsArr[0]
        conditions[k] = vAsArr.slice(1)
      })
    })
    // const conditionsKeys = Object.keys(conditions)
    // console.log()
    console.log('store.programs > filterPrograms > conditions : ', conditions)
    // console.log('store.programs > filterPrograms > conditionsKeys : ', conditionsKeys)

    // filter out programs
    const progsFiltered = progs.value.filter((prog: any) => {
      const boolArray = [true]

      // TO REWRITE => IMPLEMENT NEW CONDITIONS STRUCTURE W/ OPERATOR
      // retrieve program's conditions
      const progConditionsAlt = prog.conditions
      // console.log('store.programs > filterPrograms > progConditionsAlt : ', progConditionsAlt)
      progConditionsAlt.forEach((cond: Condition) => {
        console.log()
        const condField: string = cond.type || ''
        const condVal = cond.value
        const userChoice = conditions[condField]
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

      // ---> START --- TO COMMENT AND DELETE
      // const progConditions = prog.program_conditions
      // const progConditionsKeys = Object.keys(progConditions)
      // console.log('store.programs > filterPrograms > progCondition : ', progConditions)
      // console.log('store.programs > filterPrograms > progConditionsKeys : ', progConditionsKeys)

      // loop user conditions keys to set a filter
      // conditionsKeys.forEach(cond => {
      //   if (progConditionsKeys.includes(cond)) {
      //     // if the program contains one of user's condition
      //     // ... get condition's options 
      //     const progConditionsOpts = progConditions[cond]
      //     // console.log('store.programs > filterPrograms > progConditionsOpts : ', progConditionsOpts)

      //     // ... get user choices
      //     const userChoices = conditions[cond]
      //     // console.log('store.programs > filterPrograms > userChoices : ', userChoices)

      //     let condBool = userChoices.includes('*') || progConditionsOpts.includes('*')

      //     if (!condBool) {
      //       // ... make the intersection between user list of condition and program's conditions
      //       const intersection = progConditionsOpts.filter((v: any) => userChoices.includes(v));
      //       // console.log('store.programs > filterPrograms > intersection : ', intersection)
      //       condBool = userChoices.includes('*') || intersection.length
      //     }

      //     boolArray.push(condBool)
      //   }
      // })
      // <-- END --- TO COMMENT AND DELETE

      // by default all of user's conditions must be met
      return boolArray.every(b => !!b)
    }) 
    // console.log('store.programs > filterPrograms > progsFiltered : ', progsFiltered)

    return <ProgramData[]>progsFiltered
  }

  // actions
  function setYamlDataset (dataset: any) {
    programs.value = dataset
  }

  return { 
    programs,
    progs,
    filterPrograms,
    setYamlDataset
  }
})
