import { QuestionnaireData } from '@tee/common'

export type CompanyDataType = {
  [key in QuestionnaireDataKey]: string
}

export enum CompanyDataId {
  Siret = 'siret',
  Size = 'effectif'
}

export type QuestionnaireDataKey = keyof QuestionnaireData
