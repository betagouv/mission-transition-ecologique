import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// import { tracksStore } from './tracks'

export const programsStore = defineStore('programs', () => {

  // import from tracks
  // const tracks = tracksStore()

  // const programs = ref(programsData)
  const programs = ref()

  // getters
  const progs = computed(() => {
    return programs.value
  })

  function filterPrograms (tracksResults: any[]) {
    console.log()
    console.log('store.programs > filterPrograms > tracksResults : ', tracksResults)

    const conditions = <string[]>[]
    tracksResults.forEach(t => conditions.push(...t.values))

    const progsFiltered = programs.value.programs.map((prog: any, i: number) => {
      return {
        i: i,
        conditions: prog?.program_conditions
      }
    })
    console.log('store.programs > filterPrograms > progsFiltered : ', progsFiltered)
    return {
      tracksConditions: conditions,
      programs: progsFiltered
    }
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
