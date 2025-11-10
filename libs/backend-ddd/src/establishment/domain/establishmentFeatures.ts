import { Result } from 'true-myth'
import type { CityToRegionMappingType, EstablishmentRepository, NafRepository } from './spi'
import { Establishment, EstablishmentDetails, SearchResult, Siret } from './types'
import { EstablishmentFront, EstablishmentSearch, LegalCategory, SiretValidator, StructureSize } from '@tee/common'

export default class EstablishmentFeatures {
  private readonly _establishmentRepository: EstablishmentRepository
  private readonly _cityToRegionMapping: CityToRegionMappingType
  private readonly _nafRepository: NafRepository

  constructor(establishmentRepository: EstablishmentRepository, cityToRegionMapping: CityToRegionMappingType, nafSearch: NafRepository) {
    this._establishmentRepository = establishmentRepository
    this._cityToRegionMapping = cityToRegionMapping
    this._nafRepository = nafSearch
  }

  public async search(query: string, resultCount: number): Promise<Result<EstablishmentSearch, Error>> {
    if (SiretValidator.validate(query)) {
      const bySiretResult = await this._searchBySiret(query)
      if (bySiretResult.isOk) {
        return bySiretResult
      }
    }

    return await this._searchByQuery(query, resultCount)
  }

  public async getBySiret(siret: Siret): Promise<Result<Establishment, Error>> {
    const trimmedSiret = siret.replace(/[\s]/g, '')
    const establishmentResult: Result<EstablishmentDetails, Error> = await this._establishmentRepository.get(trimmedSiret)

    if (establishmentResult.isErr) {
      return Result.err(establishmentResult.error)
    }

    let establishment = this._addRegionToEstablishment(establishmentResult.value)
    establishment = this._addSectorDetailsToEstablishment(establishment)

    return Result.ok(establishment)
  }

  private async _searchBySiret(siret: string): Promise<Result<EstablishmentSearch, Error>> {
    const resultEstablishment = await this.getBySiret(siret)
    if (resultEstablishment.isErr) {
      return Result.err(resultEstablishment.error)
    }
    const establishmentSearch = this._convertEstablishmentToSearch(resultEstablishment.value)
    return Result.ok(establishmentSearch)
  }

  private async _searchByQuery(query: string, resultCount: number): Promise<Result<EstablishmentSearch, Error>> {
    const results = await this._establishmentRepository.search(query, resultCount)
    if (results.isOk) {
      const establishmentsSearch = this._enrichAndConvertToEstablishmentSearch(results.value)
      return Result.ok(establishmentsSearch)
    }
    return Result.err(results.error)
  }

  private _addRegionToEstablishment(establishment: Establishment): Establishment {
    const maybeRegion = this._cityToRegionMapping.getRegion(establishment.address.zipCode)
    if (maybeRegion.isNothing) {
      return establishment
    }
    return { ...establishment, region: maybeRegion.value }
  }

  private _addSectorDetailsToEstablishment(establishment: Establishment): Establishment {
    const code = establishment.nafCode
    const maybeLabel = this._nafRepository.getLabel(code)
    const maybeSectionCode = this._nafRepository.getSectionCode(code)

    if (maybeLabel.isNothing || maybeSectionCode.isNothing) {
      return establishment
    }

    return {
      ...establishment,
      nafLabel: maybeLabel.value,
      nafSectionCode: maybeSectionCode.value
    }
  }

  private _convertEstablishmentToFront(establishment: Establishment): EstablishmentFront {
    const result: EstablishmentFront = {
      siret: establishment.siret,
      codeNAF: establishment.nafCode,
      codeNAF1: establishment.nafSectionCode || '',
      ville: establishment.address.cityLabel,
      denomination: establishment.denomination || '',
      codePostal: establishment.address.zipCode,
      region: establishment.region || '',
      legalCategory: establishment.legalCategory,
      structure_size: this._computeBestStructureSizeGuess(establishment),
      secteur: establishment.nafLabel || '',
      creationDate: establishment.creationDate
    }

    return result
  }

  private _convertEstablishmentToSearch(establishment: Establishment): EstablishmentSearch {
    return {
      resultCount: 1,
      establishments: [this._convertEstablishmentToFront(establishment)]
    }
  }

  private _enrichAndConvertToEstablishmentSearch(result: SearchResult): EstablishmentSearch {
    const transformedEstablishments = result.establishments.map((establishmentDetails) => {
      let establishment = this._addRegionToEstablishment(establishmentDetails)
      establishment = this._addSectorDetailsToEstablishment(establishment)
      return this._convertEstablishmentToFront(establishment)
    })
    return { resultCount: result.resultCount, establishments: transformedEstablishments }
  }

  private _computeBestStructureSizeGuess(establishment: Establishment): StructureSize | undefined {
    if (establishment.legalCategory === LegalCategory.EI) {
      return StructureSize.EI
    }

    switch (establishment.workforceRange) {
      case '00': // 0 employee
      case '01': // 1 to 2 employees
      case '02': // 3 to 5 employees
      case '03': // 6 to 9 employees
        return StructureSize.MICRO

      case '11': // 10 to 19 employees
        return StructureSize.TPE

      case '12': // 20 to 49 employees
        return StructureSize.PE

      case '21': // 50 to 99 employees
      case '22': // 100 to 199 employees
      case '31': // 200 to 249 employees
        return StructureSize.ME

      case '32': // 250 to 499 employees
        return StructureSize.ETI

      case '41': // 500 to 999 employees
      case '51': // 1 000 to 1 999 employees
      case '52': // 2 000 to 4 999 employees
      case '53': // 5 000 to 9 999 employees
      case '54': // 10 000 employees or more
        return StructureSize.GE

      default:
        return undefined
    }
  }
}
