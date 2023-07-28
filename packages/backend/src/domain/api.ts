import { Result } from 'true-myth'
import { Etablissement } from './types'

type EtablissementResult = Result<Etablissement, Error>

export type fetchEtablissement = (siret: string) => Promise<EtablissementResult>
