import { QuestionnaireData } from '@tee/common'

export type CompanyDataType = {
  [key in QuestionnaireDataKey]: string
}

//TODO: se baser sur l'enum TrackId
export enum CompanyDataId {
  Siret = 'siret',
  Size = 'effectif'
}

export type QuestionnaireDataKey = keyof QuestionnaireData
