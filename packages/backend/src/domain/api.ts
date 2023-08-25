import { Result } from 'true-myth'
import { Etablissement, BrevoResponse } from './types'

type EtablissementResult = Result<Etablissement, Error>
export type fetchEtablissement = (siret: string) => Promise<EtablissementResult>

type BrevoResult = Result<BrevoResponse, Error>
export type postContact = (
  email: string,
  listIds: number[],
  attributes: object
  ) => Promise<BrevoResult>
