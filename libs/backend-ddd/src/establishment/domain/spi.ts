import { Maybe, Result } from 'true-myth'
import { EstablishmentDetails, SearchResult } from './types'
import { CompanyActivityType } from '@tee/common'

export type EstablishmentRepository = {
  get: (siret: string) => Promise<Result<EstablishmentDetails, Error>>
  search: (query: string, resultCount: number) => Promise<Result<SearchResult, Error>>
}

export type CityToRegionMappingType = {
  getRegion: (zipCode: string) => Maybe<string>
}

export type NafSearchType = {
  getLabel: (nafCode: string) => Maybe<string>
  getSectionCode: (nafCode: string) => Maybe<string>
  searchNAF: (searchTerm: string) => Result<CompanyActivityType[], Error>
}
