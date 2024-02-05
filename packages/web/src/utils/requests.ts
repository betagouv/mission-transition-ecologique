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
  const method = callback.method
  const headers = buildHeaders(callback)

  let data: any = callback.dataBody || callback.dataPath || callback.dataStructure || {}
  const dataMapping = callback.dataMapping.filter((dm) => !dm.onlyRemap)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  data = remapItem(data, dataMapping, formData, trackValues, props, undefined, [], lang)
  const url = replacePlaceholders(callback.url, data as Record<string, string>)
  const body = callback.dataBody ? JSON.stringify(data) : undefined

  return await sendRequest(url, method, headers, body, callback.action)
}

const replacePlaceholders = (url: string, dataPath?: Record<string, string>): string => {
  if (!dataPath) {
    return url
  }
  const placeholderRegexp = new RegExp('{([^{}]+)}', 'g')
  const matches = [...url.matchAll(placeholderRegexp)]
  const placeholders = matches.map((placeholder) => /* capture group */ placeholder[1])
  return placeholders.reduce((accu: string, placeholder: string) => replacePlaceholder(accu, placeholder, dataPath?.[placeholder]), url)
}

const replacePlaceholder = (url: string, placeholderName: string, placeholderData: string | undefined): string => {
  if (placeholderData) {
    url = url.replace('{' + placeholderName + '}', placeholderData)
  }
  return url
}

export const sendRequest = async (
  url: string,
  method: string,
  headers: HeadersInit,
  body: BodyInit | undefined,
  action: string
): Promise<ReqResp> => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: body
    })
    console.log(response)
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
