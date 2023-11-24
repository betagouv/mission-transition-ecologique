import type { MetaEnv, FormCallback, ReqResp } from '@/types/index'
// import { toRaw } from 'vue'
import { remapItem } from './helpers'

export const buildHeaders = (callback: FormCallback) => {
  return { ...callback.headers }
}

export const sendApiRequest = async (
  callback: FormCallback,
  formData: object | any,
  trackValues: any[] = [],
  props: object | any = undefined,
  lang: string = 'fr') => {
  // console.log()
  // console.log('utils > requests > sendApiRequest >  callback.action :', callback.action)
  // console.log('utils > requests > sendApiRequest >  formData :', formData)
  // console.log('utils > requests > sendApiRequest >  usedTrack :', usedTrack)
  // console.log('utils > requests > sendApiRequest >  props :', props)

  // console.log('utils > requests > sendApiRequest >  metaEnv :', metaEnv)
  const url = callback.url
  const method = callback.method
  const headers = buildHeaders(callback)
  // console.log('utils > requests > sendApiRequest >  url :', url)
  // console.log('utils > requests > sendApiRequest >  method :', method)
  // console.log('utils > requests > sendApiRequest >  headers :', headers)

  let data: any = callback.dataBody || callback.dataStructure || {}

  const dataMapping = callback.dataMapping.filter(dm => !dm.onlyRemap)
  // const listIds = metaEnv[callback.envListIds].split(',').map((id: string) => parseInt(id))
  // console.log('utils > requests > sendApiRequest >  dataMapping :', dataMapping)
  // console.log('utils > requests > sendApiRequest >  listIds :', listIds)

  data = remapItem(data, dataMapping, formData, trackValues, props, undefined, [], lang)
  // console.log('utils > requests > sendApiRequest >  data :', data)
  const body = JSON.stringify(data)
  // console.log('utils > requests > sendApiRequest >  body :', body)

  return await sendRequest(url, method, headers, body, callback.action)
}

export const sendRequest = async (url: string, method: string, headers: HeadersInit, body: BodyInit, action: string) => {
  // console.log()
  // console.log('utils > requests > sendRequest >  url :', url)
  // console.log('utils > requests > sendRequest >  method :', method)
  // console.log('utils > requests > sendRequest >  headers :', headers)

  // send request
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: body
    })
    // console.log('utils > requests > sendRequest >  response :', response)
    const respJson = await response.json()
    respJson.action = action
    respJson.ok = response.ok
    respJson.status = response.status
    respJson.statusText = response.statusText
    respJson.url = response.url

    // console.log('utils > requests > sendRequest >  respJson :', respJson)
    return respJson
  } catch (error) {
    const respObj: ReqResp = {}
    // console.log('utils > requests > sendRequest >  error :', error)
    respObj.action = action
    respObj.ok = false
    respObj.status = 500
    respObj.statusText = 'Internal server error'
    respObj.message = `${error}`

    return respObj
  }
}
