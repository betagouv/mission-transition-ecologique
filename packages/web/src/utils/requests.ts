// CONSOLE LOG TEMPLATE
// console.log(`utils.matomo > FUNCTION_NAME > MSG_OR_VALUE :`)

import { CallbackMethods, type FormCallback, type ReqResp } from '@/types/index'
import { remapItem } from './helpers'
import Translation from '@/utils/translation'

export const buildHeaders = (callback: FormCallback) => {
  return { ...callback.headers }
}

export const sendApiRequest = async (
  callback: FormCallback,
  formData: any,
  trackValues: any[] = [],
  props: any = undefined
) => {
  const method = callback.method
  const headers = buildHeaders(callback)

  const dataMapping = callback.dataMapping.filter((dm) => !dm.onlyRemap)

  let pathData: any = callback.dataPath || {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  pathData = remapItem(pathData, dataMapping, formData, trackValues, props, undefined, [], Translation.lang)
  const url = replacePlaceholders(callback.url, pathData as Record<string, string>)

  let bodyData: any = callback.dataBody || callback.dataStructure || {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  bodyData = remapItem(bodyData, dataMapping, formData, trackValues, props, undefined, [], Translation.lang)
  const body = JSON.stringify(bodyData)

  return await sendRequest(url, method, headers, body)
}

const replacePlaceholders = (url: string, dataPath?: Record<string, string>): string => {
  if (!dataPath) {
    return url
  }

  for (const placeholderName in dataPath) {
    const placeholderData = dataPath[placeholderName]
    url = replacePlaceholder(url, placeholderName, placeholderData)
  }

  return url
}

const replacePlaceholder = (url: string, placeholderName: string, placeholderData: string): string => {
  return url.replace('{' + placeholderName + '}', placeholderData)
}

export const sendRequest = async (
  url: string,
  method: CallbackMethods,
  headers: HeadersInit,
  body: BodyInit
): Promise<ReqResp> => {
  let resp: ReqResp = {}
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: method === CallbackMethods.Get ? undefined : body
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
