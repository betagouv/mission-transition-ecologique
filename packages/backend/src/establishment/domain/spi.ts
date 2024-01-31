import { Result } from 'true-myth'
import { EstablishmentDetails } from './types'

export type EstablishmentRepository = {
  get: (siret: string) => Promise<Result<EstablishmentDetails, Error>>
}

export type CityToRegionMapping = {
  getRegion: (cityCode: string) => string
}
