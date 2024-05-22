import { CalloutType } from '@/types/elementsPropsTypes'

export interface OpportunityFormType {
  [key: string]: MandatoryStringFieldFormType | StringFieldFormType | BooleanFieldFormType
  name: StringFieldFormType
  surname: StringFieldFormType
  tel: StringFieldFormType
  email: StringFieldFormType
  siret: StringFieldFormType
  needs: StringFieldFormType
  cgu: BooleanFieldFormType
  linkToProgramPage: MandatoryStringFieldFormType
}

type DefaultFieldFormType = {
  required: true
  label: string | undefined
  hint: string | undefined
  callOut?: InputCalloutType
}

export type StringFieldFormType = DefaultFieldFormType & { value: string | undefined }
export type MandatoryStringFieldFormType = DefaultFieldFormType & { value: string }
export type BooleanFieldFormType = DefaultFieldFormType & { value: boolean }

export type InputCalloutType = {
  type?: CalloutType
  content?: string
  containerClass?: string
  imgLink?: string
}
