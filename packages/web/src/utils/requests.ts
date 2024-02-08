// CONSOLE LOG TEMPLATE
// console.log(`utils.matomo > FUNCTION_NAME > MSG_OR_VALUE :`)

import { CallbackMethods, type FormCallback, type ReqResp } from '@/types/index'
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

  const dataMapping = callback.dataMapping.filter((dm) => !dm.onlyRemap)

  let pathData: any = callback.dataPath || {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  pathData = remapItem(pathData, dataMapping, formData, trackValues, props, undefined, [], lang)
  const url = replacePlaceholders(callback.url, pathData as Record<string, string>)

  let bodyData: any = callback.dataBody || callback.dataStructure || {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  bodyData = remapItem(bodyData, dataMapping, formData, trackValues, props, undefined, [], lang)
  const body = JSON.stringify(bodyData)

  return await sendRequest(url, method, headers, body, callback.action)
}

const replacePlaceholders = (url: string, dataPath?: Record<string, string>): string => {
  if (!dataPath) {
    return url
  }

  for (const placeholderName in dataPath) {
    const placeholderData = dataPath[placeholderName]
    url = replacePlaceholder(placeholderName, placeholderData, url)
  }

  return url
}

const replacePlaceholder = (url: string, placeholderName: string, placeholderData: string): string => {
  url = url.replace('{' + placeholderName + '}', placeholderData)
  return url
}

export const sendRequest = async (
  url: string,
  method: CallbackMethods,
  headers: HeadersInit,
  body: BodyInit,
  action: string
): Promise<ReqResp> => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: method === CallbackMethods.Get ? undefined : body
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
