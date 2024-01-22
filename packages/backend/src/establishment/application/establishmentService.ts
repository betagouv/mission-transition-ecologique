import EstablishmentFeatures from '../domain/establishmentFeatures'
import { getEstablishment } from '../infrastructure/api/sirene/sirene'
import { EstablishmentRepository } from '../domain/spi'
import type { Establishment, Siret } from '../domain/types'
import { Result } from 'true-myth'

export default class EstablishmentService {
  private _establishmentFeatures: EstablishmentFeatures

  constructor() {
    this._establishmentFeatures = new EstablishmentFeatures(this.getEstablishmentRepository())
  }

  public getBySiret(siret: Siret): Promise<Result<Establishment, Error>> {
    return this._establishmentFeatures.getBySiret(siret)
  }

  private getEstablishmentRepository(): EstablishmentRepository {
    return { get: getEstablishment }
  }
}
