import { createService } from '../domain/establishmentFeatures'
import { getEtablissement } from '../infrastructure/api/sirene/sirene'
import { EtablissementRepository } from '../domain/spi'

/**
 * Defines how to access external data.
 * Uses the "Repository" pattern, see README.md
 */
const etablissementRepository: EtablissementRepository = {
  get: getEtablissement
}

const service = createService(etablissementRepository)

export const fetchEtablissement = service.fetchEtablissement
