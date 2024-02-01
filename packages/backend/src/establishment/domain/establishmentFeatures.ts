import { Result } from 'true-myth'
import type { CityToRegionMapping, EstablishmentRepository, NafMapping } from './spi'
import { Establishment, EstablishmentDetails, Siret } from './types'

export default class EstablishmentFeatures {
  private readonly _establishmentRepository: EstablishmentRepository
  private readonly _cityToRegionMapping: CityToRegionMapping
  private readonly _nafMapping: NafMapping

  constructor(establishmentRepository: EstablishmentRepository, cityToRegionMapping: CityToRegionMapping, nafMapping: NafMapping) {
    this._establishmentRepository = establishmentRepository
    this._cityToRegionMapping = cityToRegionMapping
    this._nafMapping = nafMapping
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
    const maybeRegion = this._cityToRegionMapping.getRegion(establishment.address.cityCode)
    if (maybeRegion.isNothing) {
      return establishment
    }
    return { ...establishment, region: maybeRegion.value }
  }
}
