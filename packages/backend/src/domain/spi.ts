import { Result } from 'true-myth'
import { Etablissement, ContactId } from './types'

export type EtablissementRepository = {
  get: (siret: string) => Promise<Result<Etablissement, Error>>
}

export type ContactInfoRepository = {
  add: (email: string, attributes: object) => Promise<Result<ContactId, Error>>
}
