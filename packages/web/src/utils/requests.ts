// CONSOLE LOG TEMPLATE
// console.log(`utils.matomo > FUNCTION_NAME > MSG_OR_VALUE :`)

import type { FormCallback, ReqResp } from '@/types/index'
import { remapItem } from './helpers'

export const buildHeaders = (callback: FormCallback) => {
  return { ...callback.headers }
}

export const sendApiRequest = async (
  callback: FormCallback,
  formData: any,
  trackValues: any[] = [],
  props: any = undefined,
  lang: string = 'fr'
) => {
  const url = callback.url
  const method = callback.method
  const headers = buildHeaders(callback)

  let data: any = callback.dataBody || callback.dataStructure || {}
  const dataMapping = callback.dataMapping.filter((dm) => !dm.onlyRemap)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  data = remapItem(data, dataMapping, formData, trackValues, props, undefined, [], lang)
  const body = JSON.stringify(data)

  return await sendRequest(url, method, headers, body, callback.action)
}

export const sendRequest = async (url: string, method: string, headers: HeadersInit, body: BodyInit, action: string): Promise<ReqResp> => {
  // send request
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: body
    })
    const respJson: ReqResp = (await response.json()) as ReqResp
    respJson.action = action
    respJson.ok = response.ok
    respJson.status = response.status
    respJson.statusText = response.statusText
    respJson.url = response.url

    return respJson
  } catch (error: unknown) {
    const respObj: ReqResp = {}
    respObj.action = action
    respObj.ok = false
    respObj.status = 500
    respObj.statusText = 'Internal server error'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    respObj.message = `${error}`

    return respObj
  }
}
