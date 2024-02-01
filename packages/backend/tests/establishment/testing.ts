import { Maybe, Result } from 'true-myth'
import { type EstablishmentRepository } from '../../src/establishment/domain/spi'
import { type COG2023Mapping } from '../../src/establishment/infrastructure/json/cityToRegionMapping'

const exampleEstablishment = {
  siren: '830141321',
  nic: '00034',
  siret: '83014132100034',
  creationDate: '2021-12-01',
  denomination: 'MULTI',
  nafCode: '62.01Z',
  address: {
    streetNumber: '116',
    streetType: 'RUE',
    streetLabel: 'DALAYRAC',
    zipCode: '94120',
    cityLabel: 'FONTENAY-SOUS-BOIS',
    cityCode: '94033'
  },
  region: 'Île-de-France'
}

export const dummyEstablishmentRepository: EstablishmentRepository = {
  get: (_siret: string) => Promise.resolve(Result.ok(exampleEstablishment))
}

export const nothingRegionMapping: COG2023Mapping = {
  getRegion: (_cityCode: string) => Maybe.nothing<string>()
}
