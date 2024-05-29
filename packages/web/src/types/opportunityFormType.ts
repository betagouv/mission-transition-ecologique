import { CalloutType } from '@/types/elementsPropsTypes'

export interface OpportunityFormType {
  [key: string]: StringFieldInputType | MandatoryStringFieldFormType | BooleanFieldInputType | ValidatedStringFieldInputType
  name: StringFieldInputType
  surname: StringFieldInputType
  tel: ValidatedStringFieldInputType
  email: ValidatedStringFieldInputType
  siret: ValidatedStringFieldInputType
  needs: StringFieldInputType
  cgu: BooleanFieldInputType
  linkToProgramPage: MandatoryStringFieldFormType
}

type DefaultFieldFormType = {
  required: true
  isValid: boolean | undefined
  label?: string
  hint?: string
  callOut?: InputCalloutType
}

export type StringFieldInputType = DefaultFieldFormType & { value: string | undefined }
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

export const isValidatedStringFieldInputType = (field: InputFieldUnionType): field is ValidatedStringFieldInputType => {
  return 'validation' in field
}

export type InputCalloutType = {
  type?: CalloutType
  content?: string
  containerClass?: string
  imgLink?: string
}
