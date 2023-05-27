import type { MetaEnv, UsedTrack, FormCallback } from '@/types/index'
import { toRaw } from 'vue'
import { setProperty  } from './helpers'

export const buildHeaders = (metaEnv: MetaEnv | any, callback: FormCallback) => {
  console.log()
  // console.log('utils > emailing > buildHeaders >  metaEnv :', metaEnv)
  // const mode = 'cors'
  // console.log('utils > emailing > buildHeaders >  mode :', mode)

  // const method = callback.method
  const headerApiKey = callback.headerApiKey
  const headers = {...callback.headers}
  // @ts-ignore
  const apiKey = metaEnv[callback.envApiKey]
  // console.log('utils > emailing > buildHeaders >  method :', method)
  // console.log('utils > emailing > buildHeaders >  headerApiKey :', headerApiKey)
  // console.log('utils > emailing > buildHeaders >  apiKey :', apiKey)
  
  // @ts-ignore
  headers[headerApiKey] = apiKey
  // console.log('utils > emailing > buildHeaders >  headers :', headers)

  return headers
}

export const findInTracksArray = (tracksArray: object[], id: string) => {
  // console.log()
  // console.log('utils > emailing > findInTracksArray >  tracksArray :', tracksArray)
  // console.log('utils > emailing > findInTracksArray >  id :', id)

  let value = undefined
  const valObj: any = tracksArray.find((v: object) => {
    // console.log('utils > emailing > findInTracksArray >  v :', v)
    return Object.keys(v).includes(id)
  })
  // console.log('utils > emailing > findInTracksArray >  valObj :', valObj)
  value =  typeof valObj === 'object' ? valObj[id] : ''
  // console.log('utils > emailing > findInTracksArray >  value :', value)
  return value
}

export const sendApiRequest = async (callback: FormCallback, formData: object | any, usedTrack: UsedTrack[] = []) => {
  console.log()
  console.log('utils > emailing > sendApiRequest >  callback.action :', callback.action)
  console.log('utils > emailing > sendApiRequest >  formData :', formData)
  // console.log('utils > emailing > sendApiRequest >  usedTrack :', usedTrack)
  
  const metaEnv = import.meta.env
  // console.log('utils > emailing > sendApiRequest >  metaEnv :', metaEnv)
  const url = callback.url
  const method = callback.method
  const headers = buildHeaders(metaEnv, callback)
  // console.log('utils > emailing > sendApiRequest >  url :', url)
  // console.log('utils > emailing > sendApiRequest >  method :', method)
  // console.log('utils > emailing > sendApiRequest >  headers :', headers)

  const usedTrackValues = usedTrack.map(usedTrack => {
    return toRaw(usedTrack.values?.map(i => toRaw(i)))
  }).filter(i => i?.length)
  // console.log('utils > emailing > sendApiRequest >  usedTrackValues :', usedTrackValues)

  const trackValues: object[] = usedTrackValues.flat(1)
  // console.log('utils > emailing > sendApiRequest >  trackValues :', trackValues)

  let data: any = callback.dataStructure || {}

  const dataMapping = callback.dataMapping
  // const listIds = metaEnv[callback.envListIds].split(',').map((id: string) => parseInt(id))
  // console.log('utils > emailing > sendApiRequest >  dataMapping :', dataMapping)
  // console.log('utils > emailing > sendApiRequest >  listIds :', listIds)

  dataMapping.forEach(dm => {
    // console.log('utils > emailing > sendApiRequest >  dm :', dm)
    let value: any = ''
    switch (dm.from) {
      case 'env':
        value = metaEnv[dm.id]
        break
      case 'formData':
        value = formData[dm.id]
        break
      case 'usedTracks':
        value = findInTracksArray(trackValues, dm.id)
        break
      default:
        value = ''
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
    // console.log('utils > emailing > sendApiRequest >  value :', value)

    // set in data body
    data = setProperty(data, dm.dataField, value)
    // console.log('utils > emailing > sendApiRequest >  data :', data)
  })
  console.log('utils > emailing > sendApiRequest >  data :', data)
  const body = JSON.stringify(data)
  // console.log('utils > emailing > sendApiRequest >  body :', body)

  // fetch and return
  const respJson = await sendRequest(url, method, headers, body)
  return respJson
}

export const sendRequest = async (url: string, method: string, headers: any, body: any) => {
  // console.log()
  // console.log('utils > emailing > sendRequest >  url :', url)
  // console.log('utils > emailing > sendRequest >  method :', method)
  // console.log('utils > emailing > sendRequest >  headers :', headers)
  // send request
  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: body
  })
  console.log('utils > emailing > sendRequest >  response :', response)
  const respJson = await response.json()
  respJson.status = response.status
  console.log('utils > emailing > sendRequest >  respJson :', respJson)
  
  return respJson
}