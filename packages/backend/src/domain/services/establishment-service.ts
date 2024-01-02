import { createService } from '../establishment/establishment-features'
import { getEtablissement } from '../../infrastructure/sirene-API'
import { EtablissementRepository } from '../establishment/spi'

/**
 * Defines how to access external data.
 * Uses the "Repository" pattern, see README.md
 */
const etablissementRepository: EtablissementRepository = {
  get: getEtablissement
}

const service = createService(etablissementRepository)

export const fetchEtablissement = service.fetchEtablissement
