import { CalloutType, FieldType } from '@/types'
import { RouteName } from '@/types/routeType'

export interface FormDataType {
  [key: string]: InputFieldUnionType
  name: StringFieldInputType
  surname: StringFieldInputType
  tel: ValidatedStringFieldInputType
  email: ValidatedStringFieldInputType
  siret: ValidatedStringFieldInputType
  needs: StringFieldInputType
  cgu: BooleanFieldInputType
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
  callOut?: InputCalloutType
}

export type StringFieldInputType = Omit<DefaultFieldFormType, 'value'> & { value: string | undefined }
export type BooleanFieldInputType = Omit<DefaultFieldFormType, 'value'> & { value: boolean }
export type MandatoryStringFieldFormType = Omit<DefaultFieldFormType, 'value'> & { value: string }
export type ValidatedStringFieldInputType = StringFieldInputType & {
  validation: CallableFunction
  errorMessage: string
}
export type SelectFieldInputType = StringFieldInputType & { options: any }

export type StringFieldUnionType = StringFieldInputType | MandatoryStringFieldFormType | ValidatedStringFieldInputType

export type InputFieldUnionType =
  | StringFieldInputType
  | MandatoryStringFieldFormType
  | ValidatedStringFieldInputType
  | BooleanFieldInputType
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
