export interface OpportunityFormType {
  [key: string]: StringFieldInputType | BooleanFieldInputType | ValidatedStringFieldInputType
  name: StringFieldInputType
  surname: StringFieldInputType
  tel: ValidatedStringFieldInputType
  email: ValidatedStringFieldInputType
  siret: ValidatedStringFieldInputType
  needs: StringFieldInputType
  cgu: BooleanFieldInputType
  linkToProgramPage: StringFieldInputType
}

type defaultFieldInputType = { required: true }

export type StringFieldInputType = defaultFieldInputType & { value: string | undefined }
export type BooleanFieldInputType = defaultFieldInputType & { value: boolean }
export type ValidatedStringFieldInputType = StringFieldInputType & {
  validation: CallableFunction
  errorMessage: string
  isValid?: boolean | undefined
}
