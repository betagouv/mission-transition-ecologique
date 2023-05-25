import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { ProgramData, Condition } from '@/types/index'

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
    console.log('store.programs > filterPrograms > tracksResults : ', tracksResults)

    // retrieve and organize user's conditions
    const conditions: {[k: string]: any} = {}
    tracksResults.forEach(tr => {
      // tr.values.forEach((v: string) => {
      //   const vAsArr = v.split('.')
      //   const k = vAsArr[0]
      //   conditions[k] = vAsArr.slice(1)
      // })

      tr.values.forEach((v: object) => {
        for (const [key, value] of Object.entries(v)) {
          console.log(`${key}: ${value}`);
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
  // async function setDataset (path: string, deployMode: boolean, deployUrl: string) {
  //   // console.log()
  //   // console.log('store.programs > setDataset > path : ', path)
  //   // console.log('store.programs > setDataset > deployMode : ', deployMode)
  //   // console.log('store.programs > setDataset > deployUrl : ', deployUrl)

  //   let pathTrimmed = path.trim().startsWith('.') ? path.substring(1) : path
  //   pathTrimmed = pathTrimmed.trim().startsWith('/') ? pathTrimmed.substring(1) : pathTrimmed
  //   // console.log('store.programs > setDataset > pathTrimmed : ', pathTrimmed)

  //   const publicDir = 'public/'
  //   let url: string
  //   let dataset: object
  //   let response: any
  //   let errors: any[]

  //   const isExternalSource = pathTrimmed.startsWith('http')

  //   if (deployMode) {
  //     // in deployment mode
  //     if (isExternalSource) {
  //       url = pathTrimmed
  //     } else {
  //       pathTrimmed = pathTrimmed.startsWith(publicDir) ?  pathTrimmed.replace(publicDir, '') : pathTrimmed
  //       url = `${deployUrl}/${pathTrimmed}`
  //     }
  //   } else {
  //     // in local dev mode
  //     url = `./${pathTrimmed}`
  //   }
  //   // console.log('store.programs > setDataset > url : ', url )

  //   // fetch url
  //   try {
  //     response = await fetch(url)
  //     dataset = await response.json()
  //     // console.log('store.programs > setDataset > dataset : ', dataset)
  //     programs.value = dataset
  //   } catch (error) {
  //     // console.log('store.programs > setDataset > error : ', error)
  //     errors = [error]
  //     console.log('store.programs > setDataset > errors : ', errors)
  //   }
  // }

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
