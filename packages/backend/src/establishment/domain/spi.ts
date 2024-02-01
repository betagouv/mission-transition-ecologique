import { Maybe, Result } from 'true-myth'
import { EstablishmentDetails } from './types'

export type EstablishmentRepository = {
  get: (siret: string) => Promise<Result<EstablishmentDetails, Error>>
}

export type CityToRegionMapping = {
  getRegion: (cityCode: string) => Maybe<string>
}

export type NafToLabelMapping = {
  getLabel: (nafCode: string, nafLevel: number) => Maybe<string>
}
