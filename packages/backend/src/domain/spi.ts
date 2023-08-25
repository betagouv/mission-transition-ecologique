import { Result } from 'true-myth'
import { Etablissement, BrevoResponse } from './types'

export type EtablissementRepository = {
  getEtablissementBySiret: (siret: string) => Promise<Result<Etablissement, Error>>
}

export type BrevoRepository = {
  postNewContact: (
    email: string,
    listIds: number[],
    attributes: object
  ) => Promise<Result<BrevoResponse, Error>>
}
