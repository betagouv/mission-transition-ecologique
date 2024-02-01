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

    let establishment = this._addRegionToEstablishment(establishmentResult.value)
    establishment = this._addSectorDetailsToEstablishment(establishment)

    return Result.ok(establishment)
  }

  private _addRegionToEstablishment(establishment: Establishment): Establishment {
    const maybeRegion = this._cityToRegionMapping.getRegion(establishment.address.cityCode)
    if (maybeRegion.isNothing) {
      return establishment
    }
    return { ...establishment, region: maybeRegion.value }
  }

  private _addSectorDetailsToEstablishment(establishment: Establishment): Establishment {
    const code = establishment.nafCode
    const maybeLabel = this._nafMapping.getLabel(code)
    const maybeSectionLabel = this._nafMapping.getSectionLabel(code)
    const maybeSectionCode = this._nafMapping.getSectionCode(code)

    if (maybeLabel.isNothing || maybeSectionLabel.isNothing || maybeSectionCode.isNothing) {
      return establishment
    }

    return {
      ...establishment,
      nafLabel: maybeLabel.value,
      nafSectionLabel: maybeSectionLabel.value,
      nafSectionCode: maybeSectionCode.value
    }
  }
}
