import { Result } from 'true-myth'
import { Etablissement } from './types'

export type EtablissementRepository = {
  getEtablissementBySiret: (siret: string) => Promise<Result<Etablissement, Error>>
}
