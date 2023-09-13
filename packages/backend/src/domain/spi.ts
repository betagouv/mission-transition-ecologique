import { Result } from 'true-myth'
import { Etablissement, ContactInfoResponse } from './types'

export type EtablissementRepository = {
  getEtablissementBySiret: (siret: string) => Promise<Result<Etablissement, Error>>
}

export type ContactInfoRepository = {
  postNewContact: (
    email: string,
    listIds: number[],
    attributes: object
  ) => Promise<Result<ContactInfoResponse, Error>>
}
