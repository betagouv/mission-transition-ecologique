import { Result } from 'true-myth'
import type { EstablishmentRepository } from './spi'
import { Establishment, Siret } from './types'

export default class EstablishmentFeatures {
  private readonly _establishmentRepository: EstablishmentRepository

  constructor(establishmentRepository: EstablishmentRepository) {
    this._establishmentRepository = establishmentRepository
  }

  public async getBySiret(siret: Siret): Promise<Result<Establishment, Error>> {
    return this._establishmentRepository.get(siret)
  }
}
