import { Maybe, Result } from 'true-myth'
import { EstablishmentDetails } from './types'
import { EstablishementDisplay } from '@tee/common/src/establishement/types'

export type EstablishmentRepository = {
  get: (siret: string) => Promise<Result<EstablishmentDetails, Error>>
  search: (query: string) => Promise<Result<EstablishementDisplay[], Error>>
}

export type CityToRegionMapping = {
  getRegion: (cityCode: string) => Maybe<string>
}

export type NafMapping = {
  getLabel: (nafCode: string) => Maybe<string>
  getSectionCode: (nafCode: string) => Maybe<string>
}
