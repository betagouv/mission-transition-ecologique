import EstablishmentFeatures from '../domain/establishmentFeatures'
import { getEstablishment } from '../infrastructure/api/sirene/sirene'
import { CityToRegionMappingType, EstablishmentRepository, NafRepository as NafRepositoryType } from '../domain/spi'
import type { Establishment, Siret } from '../domain/types'
import { Result } from 'true-myth'
import { CityToRegionMapping } from '../infrastructure/json/cityToRegionMapping'
import { NafRepository } from '../infrastructure/json/nafRepository'
import { RechercheEntreprise } from '../infrastructure/api/recherche-entreprise/recherche-entreprise'
import { CompanyActivityType, EstablishmentSearch } from '@tee/common'

export default class EstablishmentService {
  public establishmentFeatures: EstablishmentFeatures

  constructor() {
    this.establishmentFeatures = new EstablishmentFeatures(
      this._getEstablishmentRepository(),
      this._getCityToRegionMapping(),
      this._getNafRepository()
    )
  }

  public async search(query: string, resultCount: number): Promise<Result<EstablishmentSearch, Error>> {
    return await this.establishmentFeatures.search(query, resultCount)
  }

  public async getBySiret(siret: Siret): Promise<Result<Establishment, Error>> {
    return await this.establishmentFeatures.getBySiret(siret)
  }

  public searchNAF(query: string): Result<CompanyActivityType[], Error> {
    try {
      return new NafRepository().searchNAF(query)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }

  private _getEstablishmentRepository(): EstablishmentRepository {
    const rechercheEntreprise = new RechercheEntreprise()
    return { get: getEstablishment, search: rechercheEntreprise.searchEstablishment }
  }

  private _getCityToRegionMapping(): CityToRegionMappingType {
    return new CityToRegionMapping()
  }

  private _getNafRepository(): NafRepositoryType {
    return new NafRepository()
  }
}
