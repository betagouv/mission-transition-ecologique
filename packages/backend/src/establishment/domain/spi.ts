import { Result } from 'true-myth'
import { Etablissement } from './types'

export type EtablissementRepository = {
  get: (siret: string) => Promise<Result<Etablissement, Error>>
}
