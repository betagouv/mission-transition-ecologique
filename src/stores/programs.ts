import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// import { tracksStore } from './tracks'
interface ProgramConditions {
  project_needs?: string[],
  project_status?: string[],
  project_sectors?: string[],
  structure_sizes?: string[],
}
interface ProgramData {
  index?: string | number,
  title: string,
  resume?: string,
  description?: string,
  program_type?: string
  program_conditions?: ProgramConditions
}

export const programsStore = defineStore('programs', () => {

  // import from tracks
  // const tracks = tracksStore()

  // const programs = ref(programsData)
  const programs = ref()

  // getters
  const progs = computed(() => {
    const progsIndexed = programs.value.programs.map((p: object | any, i: number) => {
      return {
        index: i.toString(),
        ...p
      }
    })
    return { programs: progsIndexed }
  })

  function filterPrograms (tracksResults: any[]) {
    console.log()
    console.log('store.programs > filterPrograms > tracksResults : ', tracksResults)

    // retrieve and organize user's conditions
    const conditions: {[k: string]: any} = {}
    tracksResults.forEach(tr => {
      tr.values.forEach((v: string) => {
        const vAsArr = v.split('.')
        const k = vAsArr[0]
        conditions[k] = vAsArr.slice(1)
      })
    })
    const conditionsKeys = Object.keys(conditions)

    // filter out programs
    const progsFiltered = progs.value.programs.filter((prog: any) => {
      const boolArray = [true]
      console.log()
      console.log('store.programs > filterPrograms > conditions : ', conditions)
      console.log('store.programs > filterPrograms > conditionsKeys : ', conditionsKeys)

      // retrieve program's conditions
      const progConditions = prog.program_conditions
      const progConditionsKeys = Object.keys(progConditions)
      // console.log('store.programs > filterPrograms > progCondition : ', progConditions)
      console.log('store.programs > filterPrograms > progConditionsKeys : ', progConditionsKeys)

      // loop user conditions keys to set a filter
      conditionsKeys.forEach(cond => {
        if (progConditionsKeys.includes(cond)) {
          // if the program contains one of user's condition
          // ... get condition's options 
          const progConditionsOpts = progConditions[cond]
          console.log('store.programs > filterPrograms > progConditionsOpts : ', progConditionsOpts)

          // ... get user choices
          const userChoices = conditions[cond]
          console.log('store.programs > filterPrograms > userChoices : ', userChoices)

          // ... make the intersection between user list of condition and program's conditions
          const intersection = progConditionsOpts.filter((v: any) => userChoices.includes(v));
          console.log('store.programs > filterPrograms > intersection : ', intersection)

          const condBool = intersection.length
          boolArray.push(condBool)
        }
      })

      // by default all of user's conditions must be met
      return boolArray.every(b => !!b)
    }) 
    console.log('store.programs > filterPrograms > progsFiltered : ', progsFiltered)

    // return {
    //   conditions: conditions,
    //   programs: progsFiltered
    // }

    return <ProgramData[]>progsFiltered
  }

  // actions
  async function setDataset (path: string, deployMode: boolean, deployUrl: string) {
    // console.log()
    // console.log('store.programs > setDataset > path : ', path)
    // console.log('store.programs > setDataset > deployMode : ', deployMode)
    // console.log('store.programs > setDataset > deployUrl : ', deployUrl)

    let pathTrimmed = path.trim().startsWith('.') ? path.substring(1) : path
    pathTrimmed = pathTrimmed.trim().startsWith('/') ? pathTrimmed.substring(1) : pathTrimmed
    // console.log('store.programs > setDataset > pathTrimmed : ', pathTrimmed)

    const publicDir = 'public/'
    let url: string
    let dataset: object
    let response: any
    let errors: any[]

    const isExternalSource = pathTrimmed.startsWith('http')

    if (deployMode) {
      // in deployment mode
      if (isExternalSource) {
        url = pathTrimmed
      } else {
        pathTrimmed = pathTrimmed.startsWith(publicDir) ?  pathTrimmed.replace(publicDir, '') : pathTrimmed
        url = `${deployUrl}/${pathTrimmed}`
      }
    } else {
      // in local dev mode
      url = `./${pathTrimmed}`
    }
    // console.log('store.programs > setDataset > url : ', url )
    
    // fetch url
    try {
      response = await fetch(url)
      dataset = await response.json()
      // console.log('store.programs > setDataset > dataset : ', dataset)
      programs.value = dataset
    } catch (error) {
      // console.log('store.programs > setDataset > error : ', error)
      errors = [error]
      console.log('store.programs > setDataset > errors : ', errors)
    }
  }

  return { 
    programs,
    progs,
    filterPrograms,
    setDataset
  }
})
