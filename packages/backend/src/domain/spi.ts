import { Result } from 'true-myth'
import { Etablissement, ContactId } from './types'

export type EtablissementRepository = {
  getEtablissementBySiret: (siret: string) => Promise<Result<Etablissement, Error>>
}

export type ContactInfoRepository = {
  storeContactInfo: (
    email: string,
    listIds: number[],
    attributes: object
  ) => Promise<Result<ContactId, Error>>
}
