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
  label: string | undefined
  hint?: string | undefined
}

export type StringFieldInputType = DefaultFieldFormType & { value: string | undefined }
export type BooleanFieldInputType = DefaultFieldFormType & { value: boolean }
export type MandatoryStringFieldFormType = DefaultFieldFormType & { value: string }
export type ValidatedStringFieldInputType = StringFieldInputType & {
  validation: CallableFunction
  errorMessage: string
  isValid?: boolean | undefined
}
