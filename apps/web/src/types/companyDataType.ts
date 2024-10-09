import { QuestionnaireData } from '@tee/common'

export type CompanyDataType = {
  [key in QuestionnaireDataKey]: string
}

//TODO: se baser sur l'enum TrackId
export enum CompanyDataId {
  Siret = 'siret',
  Size = 'structure_size'
}

export type QuestionnaireDataKey = keyof QuestionnaireData
