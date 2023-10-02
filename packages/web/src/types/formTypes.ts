import type { Translations } from './translationTypes'
import type { 
  DataMappingFroms,
  Cleaner,
  CleanerReplaceAll,
  CleanerFromJson,
  CleanerFromDict,
  CleanerDefaultIfNull,
  CallbackActions,
  CallbackMethods,
  ResultsMapping
} from './otherTypes'

// FOR FORMS

export interface FormValues {
  [name: string]: any,
}

enum FormFieldTypes {
  text = 'text',
  email = 'email',
  textarea = 'textarea',
  checkbox = 'checkbox',
}

export interface FormCallbackDataMapping {
  from: DataMappingFroms,
  id: string,
  dataField: string,
  path?: string,
  asArray?: boolean
  sep?: string
  type?: string,
  subKey?: string,
  onlyRemap?: boolean,
  cleaning?:  Cleaner[] | CleanerReplaceAll[] | CleanerFromJson[] | CleanerFromDict[] | CleanerDefaultIfNull[]
}

export interface FormField {
  id: string,
  help?: string,
  required: boolean,
  label?: any,
  hint?: any,
  cols?: number,
  type?: FormFieldTypes,
  rows?: number,
  defaultValue?: boolean | string | number,
  
  injectInText?: boolean,
  dataStructure?: object,
  dataMapping?: FormCallbackDataMapping[],
  preFillFrom?: FormCallbackDataMapping,
}

export interface FormCallback {
  disabled?: boolean,
  help?: string | string[],
  helpDocumentation?: string,
  action: CallbackActions,
  url: string,
  headers: object,
  headerApiKey: string,
  envApiKey: string,
  method: CallbackMethods,
  dataBody?: object | object[],
  dataStructure: object | object[],
  dataMapping: FormCallbackDataMapping[]
  inputCleaning?: Cleaner[] | CleanerReplaceAll[] | CleanerFromJson[] | CleanerFromDict[] | CleanerDefaultIfNull[],
  resultsMapping?: ResultsMapping[]
}

export interface FormOptions {
  value: string | number,
  label?: Translations,
  hint?: Translations,
  intro?: Translations,
  fields?: FormField[],
  next?: string,
  callbacks: FormCallback[],
}

export interface FormDataResp {
  value: string,
  next: string,
  data: any
}