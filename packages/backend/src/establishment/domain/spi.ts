import { Maybe, Result } from 'true-myth'
import { EstablishmentDetails } from './types'

export type EstablishmentRepository = {
  get: (siret: string) => Promise<Result<EstablishmentDetails, Error>>
}

export type CityToRegionMapping = {
  getRegion: (cityCode: string) => Maybe<string>
}

export type NafMapping = {
  getLabel: (nafCode: string) => Maybe<string>
  getSectionLabel: (nafCode: string) => Maybe<string>
  getSectionCode: (nafCode: string) => Maybe<string>
}
