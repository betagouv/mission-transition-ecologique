import { QuestionnaireData } from '@tee/common'

export enum CompanyDataId {
  Siret = 'siret',
  Size = 'structure_size'
}

export type QuestionnaireDataKey = keyof QuestionnaireData
