import { Result } from 'true-myth'
import type { CityToRegionMapping, EstablishmentRepository } from './spi'
import { Establishment, EstablishmentDetails, Siret } from './types'

export default class EstablishmentFeatures {
  private readonly _establishmentRepository: EstablishmentRepository
  private readonly _cityToRegionMapping: CityToRegionMapping

  constructor(establishmentRepository: EstablishmentRepository, cityToRegionMapping: CityToRegionMapping) {
    this._establishmentRepository = establishmentRepository
    this._cityToRegionMapping = cityToRegionMapping
  }

  public async getBySiret(siret: Siret): Promise<Result<Establishment, Error>> {
    const establishmentResult: Result<EstablishmentDetails, Error> = await this._establishmentRepository.get(siret)

    if (establishmentResult.isErr) {
      return Result.err(establishmentResult.error)
    }

    const establishment = this._addRegionToEstablishment(establishmentResult.value)

    return Result.ok(establishment)
  }

  private _addRegionToEstablishment(establishment: EstablishmentDetails): Establishment {
    const region = this._cityToRegionMapping.getRegion(establishment.address.cityCode)
    return { ...establishment, region: region }
  }
}
