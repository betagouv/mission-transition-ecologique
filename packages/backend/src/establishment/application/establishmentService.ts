import { createService } from '../domain/establishmentFeatures'
import { getEstablishment } from '../infrastructure/api/sirene/sirene'
import { EstablishmentRepository } from '../domain/spi'

/**
 * Defines how to access external data.
 * Uses the "Repository" pattern, see README.md
 */
const establishmentRepository: EstablishmentRepository = {
  get: getEstablishment
}

const service = createService(establishmentRepository)

export const fetchEstablishment = service.fetchEstablishment
