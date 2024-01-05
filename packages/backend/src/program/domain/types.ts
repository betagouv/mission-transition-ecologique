export interface QuestionnaireData {
  codeNaf?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface PublicodesInputData {
  'entreprise . code NAF'?: string
  'dispositif . début de validité'?: string
  'dispositif . fin de validité'?: string
  'date du jour': string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
