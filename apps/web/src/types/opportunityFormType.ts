import { CalloutType, FieldType } from '@/types'
import { RouteName } from '@/types/routeType'

export interface FormDataType {
  [key: string]:
    | StringFieldInputType
    | MandatoryStringFieldFormType
    | BooleanFieldInputType
    | ValidatedStringFieldInputType
    | SelectFieldInputType
  name: StringFieldInputType
  surname: StringFieldInputType
  tel: ValidatedStringFieldInputType
  email: ValidatedStringFieldInputType
  siret: ValidatedStringFieldInputType
  needs: StringFieldInputType
  cgu: BooleanFieldInputType
  linkToPage: MandatoryStringFieldFormType
}

type DefaultFieldFormType = {
  required: true
  type: FieldType
  isValid: boolean | undefined
  hidden?: boolean
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
  callOut?: InputCalloutType
}

export type StringFieldInputType = DefaultFieldFormType & { value: string | undefined }
export type SelectFieldInputType = DefaultFieldFormType & { value: { text: string; value: any } }
export type BooleanFieldInputType = DefaultFieldFormType & { value: boolean }
export type MandatoryStringFieldFormType = DefaultFieldFormType & { value: string }
export type ValidatedStringFieldInputType = StringFieldInputType & {
  validation: CallableFunction
  errorMessage: string
}

export type InputFieldUnionType =
  | StringFieldInputType
  | MandatoryStringFieldFormType
  | BooleanFieldInputType
  | ValidatedStringFieldInputType
  | SelectFieldInputType

export const isValidatedStringFieldInputType = (field: InputFieldUnionType): field is ValidatedStringFieldInputType => {
  return 'validation' in field
}

export type InputCalloutType = {
  type?: CalloutType
  content?: string
  containerClass?: string
  img?: string
}
