import { CalloutType, FieldType } from '@/types'
import { RouteName } from '@/types/routeType'

export interface FormDataType {
  [key: string]: DefaultFieldFormType
  name: DefaultFieldFormType
  surname: DefaultFieldFormType
  tel: DefaultFieldFormType
  email: DefaultFieldFormType
  siret: DefaultFieldFormType
  needs: DefaultFieldFormType
  cgu: DefaultFieldFormType
  linkToPage: DefaultFieldFormType
}

export type DefaultFieldFormType = {
  required: true
  type: FieldType
  isValid: boolean | undefined
  hidden?: boolean
  value: any
  label?: string
  hint?: string
  hintLink?: {
    route: RouteName
    text: string
  }
  wrapperClass?: string
  rows?: number
  colSize?: number
  options?: any[]
  validation?: CallableFunction
  errorMessage?: string
  callOut?: InputCalloutType
}

export const isValidatedStringFieldInputType = (field: DefaultFieldFormType) => {
  return 'validation' in field
}

export type InputCalloutType = {
  type?: CalloutType
  content?: string
  containerClass?: string
  img?: string
}
