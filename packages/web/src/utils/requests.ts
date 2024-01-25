// CONSOLE LOG TEMPLATE
// console.log(`utils.matomo > FUNCTION_NAME > MSG_OR_VALUE :`)

import type { FormCallback, ReqResp } from '@/types'
import { remapItem } from './helpers'
import Translation from '@/utils/translation'

export const buildHeaders = (callback: FormCallback) => {
  return { ...callback.headers }
}

export const sendApiRequest = async (callback: FormCallback, formData: any, trackValues: any[] = [], props: any = undefined) => {
  const url = callback.url
  const method = callback.method
  const headers = buildHeaders(callback)

  let data: any = callback.dataBody || callback.dataStructure || {}
  const dataMapping = callback.dataMapping.filter((dm) => !dm.onlyRemap)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  data = remapItem(data, dataMapping, formData, trackValues, props, undefined, [], Translation.lang)
  const body = JSON.stringify(data)

  return await sendRequest(url, method, headers, body)
}

export const sendRequest = async (url: string, method: string, headers: HeadersInit, body: BodyInit): Promise<ReqResp> => {
  // send request
  let resp: ReqResp = {}
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: body
    })
    resp = (await response.json()) as ReqResp
    resp.ok = response.ok
    resp.status = response.status
    resp.statusText = response.statusText
    resp.url = response.url
  } catch (error: unknown) {
    resp.ok = false
    resp.status = 500
    resp.statusText = 'Internal server error'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    resp.message = `${error}`
  }

  return resp
}
