import { Result } from 'true-myth'
import { Etablissement, ContactId } from './types'

export type EtablissementRepository = {
  get: (siret: string) => Promise<Result<Etablissement, Error>>
}

export type ContactInfoRepository = {
  add: (email: string, listIds: number[], attributes: object) => Promise<Result<ContactId, Error>>
}
