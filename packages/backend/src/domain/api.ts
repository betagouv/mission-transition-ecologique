import { Result } from 'true-myth'
import { Etablissement, ContactId } from './types'

type EtablissementResult = Result<Etablissement, Error>

export type fetchEtablissement = (siret: string) => Promise<EtablissementResult>

export type postNewContact = (email: string, attributes: object) => Promise<Result<ContactId, Error>>
