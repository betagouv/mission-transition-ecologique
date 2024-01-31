import EstablishmentFeatures from '../domain/establishmentFeatures'
import { getEstablishment } from '../infrastructure/api/sirene/sirene'
import { CityToRegionMapping, EstablishmentRepository } from '../domain/spi'
import type { EstablishmentDetails, Siret } from '../domain/types'
import { Result } from 'true-myth'

const dummyGetRegion = (_cityCode: string): string => {
  return 'bretagne'
}

export default class EstablishmentService {
  private _establishmentFeatures: EstablishmentFeatures

  constructor() {
    this._establishmentFeatures = new EstablishmentFeatures(this._getEstablishmentRepository(), this._getCityToRegionMapping())
  }

  public getBySiret(siret: Siret): Promise<Result<EstablishmentDetails, Error>> {
    return this._establishmentFeatures.getBySiret(siret)
  }

  private _getEstablishmentRepository(): EstablishmentRepository {
    return { get: getEstablishment }
  }

  private _getCityToRegionMapping(): CityToRegionMapping {
    return { getRegion: dummyGetRegion }
  }
}
