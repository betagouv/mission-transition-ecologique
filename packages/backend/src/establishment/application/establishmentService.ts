import EstablishmentFeatures from '../domain/establishmentFeatures'
import { getEstablishment } from '../infrastructure/api/sirene/sirene'
import { CityToRegionMapping, EstablishmentRepository, NafMapping } from '../domain/spi'
import type { Establishment, EstablishmentDetails, Siret } from '../domain/types'
import { Result } from 'true-myth'
import { COG2023Mapping } from '../infrastructure/json/cityToRegionMapping'
import { NAF_JSONMapping } from '../infrastructure/json/nafMapping'

export default class EstablishmentService {
  private _establishmentFeatures: EstablishmentFeatures

  constructor() {
    this._establishmentFeatures = new EstablishmentFeatures(
      this._getEstablishmentRepository(),
      this._getCityToRegionMapping(),
      this._getNafMapping()
    )
  }

  public getBySiret(siret: Siret): Promise<Result<EstablishmentDetails, Error>> {
    return this._establishmentFeatures.getBySiret(siret)
  }

  public getFullDataBySiret(siret: Siret): Promise<Result<Establishment, Error>> {
    return this._establishmentFeatures.getBySiret(siret)
  }

  private _getEstablishmentRepository(): EstablishmentRepository {
    return { get: getEstablishment }
  }

  private _getCityToRegionMapping(): CityToRegionMapping {
    return new COG2023Mapping()
  }

  private _getNafMapping(): NafMapping {
    return new NAF_JSONMapping()
  }
}
