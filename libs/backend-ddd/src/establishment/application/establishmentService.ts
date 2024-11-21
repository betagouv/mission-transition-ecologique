import EstablishmentFeatures from '../domain/establishmentFeatures'
import { getEstablishment } from '../infrastructure/api/sirene/sirene'
import { CityToRegionMappingType, EstablishmentRepository, NafMappingType } from '../domain/spi'
import type { Establishment, Siret } from '../domain/types'
import { Result } from 'true-myth'
import { CityToRegionMapping } from '../infrastructure/json/cityToRegionMapping'
import { NafJsonMapping } from '../infrastructure/json/nafJsonMapping'
import { RechercheEntreprise } from '../infrastructure/api/recherche-entreprise/recherche-entreprise'
import { CompanyActivityType, EstablishmentSearch } from '@tee/common'

export default class EstablishmentService {
  private _establishmentFeatures: EstablishmentFeatures

  constructor() {
    this._establishmentFeatures = new EstablishmentFeatures(
      this._getEstablishmentRepository(),
      this._getCityToRegionMapping(),
      this._getNafMapping()
    )
  }

  public search(query: string, resultCount: number): Promise<Result<EstablishmentSearch, Error>> {
    return this._establishmentFeatures.search(query, resultCount)
  }

  public getBySiret(siret: Siret): Promise<Result<Establishment, Error>> {
    return this._establishmentFeatures.getBySiret(siret)
  }

  public searchNAF(query: string): Promise<Result<CompanyActivityType, Error>> {
    return new NafJsonMapping().searchNAF(query)
  }

  private _getEstablishmentRepository(): EstablishmentRepository {
    const rechercheEntreprise = new RechercheEntreprise()
    return { get: getEstablishment, search: rechercheEntreprise.searchEstablishment }
  }

  private _getCityToRegionMapping(): CityToRegionMappingType {
    return new CityToRegionMapping()
  }

  private _getNafMapping(): NafMappingType {
    return new NafJsonMapping()
  }
}
