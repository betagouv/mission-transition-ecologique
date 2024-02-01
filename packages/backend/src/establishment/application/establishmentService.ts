import EstablishmentFeatures from '../domain/establishmentFeatures'
import { getEstablishment } from '../infrastructure/api/sirene/sirene'
import { CityToRegionMapping, EstablishmentRepository } from '../domain/spi'
import type { EstablishmentDetails, Siret } from '../domain/types'
import { Maybe, Result } from 'true-myth'
import { COG2023Mapping } from '../infrastructure/json/cityToRegionMapping'

export default class EstablishmentService {
  private _establishmentFeatures: EstablishmentFeatures

  constructor() {
    this._establishmentFeatures = new EstablishmentFeatures(
      this._getEstablishmentRepository(),
      this._getCityToRegionMapping(),
      dummyEstablishmentRepository
    )
  }

  public getBySiret(siret: Siret): Promise<Result<EstablishmentDetails, Error>> {
    return this._establishmentFeatures.getBySiret(siret)
  }

  private _getEstablishmentRepository(): EstablishmentRepository {
    return { get: getEstablishment }
  }

  private _getCityToRegionMapping(): CityToRegionMapping {
    return new COG2023Mapping()
  }
}

const dummyEstablishmentRepository = {
  getLabel: (_nafCode: string) => Maybe.nothing<string>(),
  getSectionLabel: (_nafCode: string) => Maybe.nothing<string>(),
  getSectionCode: (_nafCode: string) => Maybe.nothing<string>()
}
