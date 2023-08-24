import { Result } from 'true-myth'
import { Etablissement } from './types.js'

export type EtablissementRepository = {
  getEtablissementBySiret: (siret: string) => Promise<Result<Etablissement, Error>>
}
