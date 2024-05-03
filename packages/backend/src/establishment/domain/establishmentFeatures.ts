import { Result } from 'true-myth'
import type { CityToRegionMapping, EstablishmentRepository, NafMapping } from './spi'
import { Establishment, EstablishmentDetails, Siret, EstablishementDisplay } from './types'
import Validator from '../../../../common/src/establishement/validator'

export default class EstablishmentFeatures {
  private readonly _establishmentRepository: EstablishmentRepository
  private readonly _cityToRegionMapping: CityToRegionMapping
  private readonly _nafMapping: NafMapping

  constructor(establishmentRepository: EstablishmentRepository, cityToRegionMapping: CityToRegionMapping, nafMapping: NafMapping) {
    this._establishmentRepository = establishmentRepository
    this._cityToRegionMapping = cityToRegionMapping
    this._nafMapping = nafMapping
  }

  public async search(query: string): Promise<Result<EstablishementDisplay[], Error>> {
    if (Validator.validateSiret(query)) {
      const resultEstablishement = await this.getBySiret(query)
      if (resultEstablishement.isErr) {
        return Result.err(resultEstablishement.error)
      }
      const establishmentDisplay = this._convertEstablishmentToDisplay(resultEstablishement.value)
      return Result.ok([establishmentDisplay])
    }

    const results = await this._establishmentRepository.search(query)
    if (results.isOk) {
      const mappedResults = results.value.map((establishment: EstablishementDisplay) => {
        const mappedRegion = this._cityToRegionMapping.getRegion(establishment.region)
        establishment.region = mappedRegion.isJust ? mappedRegion.value : ''

        const maybeLabel = this._nafMapping.getLabel(establishment.sector)
        establishment.sector = maybeLabel.isJust ? maybeLabel.value : ''
        return establishment
      })
      return Result.ok(mappedResults)
    }
    return results
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
    const maybeSectionCode = this._nafMapping.getSectionCode(code)

    if (maybeLabel.isNothing || maybeSectionCode.isNothing) {
      return establishment
    }

    return {
      ...establishment,
      nafLabel: maybeLabel.value,
      nafSectionCode: maybeSectionCode.value
    }
  }

  private _convertEstablishmentToDisplay(establishment: Establishment): EstablishementDisplay {
    return {
      siret: establishment.siret,
      creationDate: establishment.creationDate,
      address: `${establishment.address.streetNumber} ${establishment.address.streetType} ${establishment.address.streetLabel}, ${establishment.address.zipCode} ${establishment.address.cityLabel}`,
      sector: establishment.nafLabel || '',
      name: establishment.denomination,
      region: establishment.region || ''
    }
  }
}
