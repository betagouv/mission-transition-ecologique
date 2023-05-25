import type { UsedTrack, FormCallback } from '@/types/index'
import { toRaw } from 'vue'

export const sendEmail = async (formCallbacks: FormCallback[], formData: object | any, usedTrack: UsedTrack[]) => {
  console.log()
  console.log('utils > emailing > sendEmail >  formCallbacks :', formCallbacks)
  console.log('utils > emailing > sendEmail >  formData :', formData)
  console.log('utils > emailing > sendEmail >  usedTrack :', usedTrack)

  const usedTrackValues = usedTrack.map(usedTrack => {
    return toRaw(usedTrack.values?.map(i => toRaw(i)))
  }).filter(i => i?.length)
  console.log('utils > emailing > sendEmail >  usedTrackValues :', usedTrackValues)

  const metaEnv = import.meta.env
  console.log('utils > emailing > sendEmail >  metaEnv :', metaEnv)
  const mode = 'cors'
  console.log('utils > emailing > sendEmail >  mode :', mode)

  for (const callback of formCallbacks) {
    console.log()
    const url = callback.url
    const method = callback.method
    const headerApiKey = callback.headerApiKey
    const headers = {...callback.headers}
    const apiKey = metaEnv[callback.envApiKey]
    console.log('utils > emailing > sendEmail >  url :', url)
    console.log('utils > emailing > sendEmail >  method :', method)
    // console.log('utils > emailing > sendEmail >  headerApiKey :', headerApiKey)
    // console.log('utils > emailing > sendEmail >  apiKey :', apiKey)
    
    // @ts-ignore
    headers[headerApiKey] = apiKey
    console.log('utils > emailing > sendEmail >  headers :', headers)
    
    const dataMapping = callback.dataMapping
    // const listIds = metaEnv[callback.envListIds].split(',').map((id: string) => parseInt(id))
    console.log('utils > emailing > sendEmail >  dataMapping :', dataMapping)
    // console.log('utils > emailing > sendEmail >  listIds :', listIds)

    const data: any = {}
    dataMapping.forEach(dm => {
      const subKey = dm.subKey
      let value: any = ''
      switch (dm.from) {
        case 'env':
          value = metaEnv[dm.id]
          break
        case 'formData':
          value = formData[dm.id]
          break
        case 'store':
          value = formData[dm.id]
          break
      }
      // parse as array
      if (dm.asArray) {
        value = value.split( dm.sep || ',')
        if (dm.type === 'integer') { value = value.map((v: string) => parseInt(v)) }
      }
      // as integer
      if (!dm.asArray && dm.type === 'integer') {
        value = parseInt(value)
      }
      // build data's subKey
      if (subKey && !data[subKey]) {
        data[subKey] = {}
      }
      if (subKey) {
        data[subKey][dm.dataField] = value
      } else {
        data[dm.dataField] = value
      }
    })
    console.log('utils > emailing > sendEmail >  data :', data)
    const body = JSON.stringify(data)
    console.log('utils > emailing > sendEmail >  body :', body)

    // const response = await fetch(url, {
    //   method: method,
    //   headers: headers,
    // })
    // return response.json()
  }
} 