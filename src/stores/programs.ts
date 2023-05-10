import { ref } from 'vue'
import { defineStore } from 'pinia'

// import { tracksStore } from './tracks'

// import programsData from '../assets/data/eco-aides.json'

export const programsStore = defineStore('programs', () => {

  // import from tracks
  // const tracks = tracksStore()

  // const programs = ref(programsData)
  const programs = ref()

  async function setDataset (path: string, deployMode: boolean, deployUrl: string) {
    console.log()
    console.log('store.programs > setDataset > path : ', path)
    console.log('store.programs > setDataset > deployMode : ', deployMode)
    console.log('store.programs > setDataset > deployUrl : ', deployUrl)

    let pathTrimmed = path.trim().startsWith('.') ? path.substring(1) : path
    pathTrimmed = pathTrimmed.trim().startsWith('/') ? pathTrimmed.substring(1) : pathTrimmed
    console.log('store.programs > setDataset > pathTrimmed : ', pathTrimmed)

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
    console.log('store.programs > setDataset > url : ', url )
    
    // fetch url
    try {
      response = await fetch(url)
      dataset = await response.json()
      console.log('store.programs > setDataset > dataset : ', dataset)
      programs.value = dataset
    } catch (error) {
      console.log('store.programs > setDataset > error : ', error)
      errors = [error]
      console.log('store.programs > setDataset > errors : ', errors)
    }
  }

  return { 
    programs,
    setDataset
  }
})
