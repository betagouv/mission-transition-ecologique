import { Result } from 'true-myth'
import { Establishment } from './types'

export type EstablishmentRepository = {
  get: (siret: string) => Promise<Result<Establishment, Error>>
}
