import { Maybe, Result } from 'true-myth'
import { EstablishmentDetails, SearchResult } from './types'

export type EstablishmentRepository = {
  get: (siret: string) => Promise<Result<EstablishmentDetails, Error>>
  search: (query: string, resultCount: number) => Promise<Result<SearchResult, Error>>
}

export type CityToRegionMappingType = {
  getRegion: (zipCode: string) => Maybe<string>
}

export type NafMappingType = {
  getLabel: (nafCode: string) => Maybe<string>
  getSectionCode: (nafCode: string) => Maybe<string>
}
