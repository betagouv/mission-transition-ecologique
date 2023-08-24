import { Router, Request, Response } from 'express'
import { requestSireneAPI } from '../infrastructure/sirene-API.js'
import { createFeatures } from '../domain/features.js'

import * as dotenv from 'dotenv'
import { EtablissementRepository } from '../domain/spi.js'

const router = Router()

dotenv.config()

/**
 * etablissementRepository defines infrastructure access modalities
 * according to the domain Service Provider Interface (spi)
 */
const etablissementRepository: EtablissementRepository = {
  getEtablissementBySiret: async (siret: string) =>
    requestSireneAPI(siret, process.env['SIRENE_API_TOKEN'] || '')
}

router.get('/health', (_req: Request, res: Response): void => {
  res.sendStatus(200)
})

router.post('/insee/get_by_siret', async (req: Request, res: Response): Promise<void> => {
  const requestedSiret = req.body.siret

  const feat = createFeatures(etablissementRepository)
  const etablissementResult = await feat.fetchEtablissement(requestedSiret)

  if (etablissementResult.isErr) {
    const error = etablissementResult.error
    res.status(401).send(error.message)
  }

  if (etablissementResult.isOk) {
    const etablissement = etablissementResult.value
    res.send(etablissement)
  }
})

export default router
