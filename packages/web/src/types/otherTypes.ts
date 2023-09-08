import type { Translations } from './translationTypes'

// FOR COMPONENTS

export interface ColsOptions {
  [name: string]: number | string
}

export interface Plugin {
  plugin: any,
  options?: object | null,
  icons?: any[] | null
}
export interface Comp {
  name: string,
  comp: object
}

// FOR REQUESTS

export interface ResultsMapping {
  respFields: string[],
  position?: string,
  label?: string,
  icon?: string,
  class?: string,
  sep?: string,
  style?: string,
  cleaning?:  Cleaner[] | CleanerReplaceAll[] | CleanerFromJson[] | CleanerDefaultIfNull[]
}

export interface ReqError {
  ok?: boolean,
  status?: number,
  statusText?: string,
}
export interface ReqResp extends ReqError {
  action?: CallbackActions,
  code?: string,
  message?: string,
  data?: any,
  raw?: any,
  resultsMapping?: ResultsMapping[]
}


// FOR EMAILING / REQUESTS

export interface EmailData {
  name: string,
  email: string,
}

export enum DataMappingFroms {
  env = 'env',
  formData = 'formData',
  usedTracks = 'usedTracks',
  props = 'props',
  rawData = 'rawData',
}

export enum CallbackMethods {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
}
export enum CallbackActions {
  requestAPI = 'requestAPI',
  createContact = 'createContact',
  sendTransactionalEmail = 'sendTransactionalEmail'
}
export enum CleanerOperations {
  replaceAll = 'replaceAll',
  stringToDate = 'stringToDate',
  findFromRefs = 'findFromRefs',
  findFromDict = 'findFromDict',
  defaultIfNull = 'defaultIfNull',
}

export interface Cleaner {
  operation: CleanerOperations,
}

export interface CleanerDefaultIfNull extends Cleaner {
  // respFields: string,
  defaultValue : Translations,
}
export interface CleanerReplaceAll extends Cleaner {
  stringToReplace: string,
  replaceBy: string, 
}

export enum FindInRefs {
  nafCodes= 'nafCodes'
}
export interface CleanerFromJson extends Cleaner {
  findInRef: FindInRefs,
  findFromField: string,
  retrieveFromField: string,
}

export interface CleanerFromDict extends Cleaner {
  dict: any, 
}
