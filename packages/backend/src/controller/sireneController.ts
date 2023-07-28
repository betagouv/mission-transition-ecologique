import { Body, Controller, Get, Post, Route, SuccessResponse, TsoaResponse, Res } from 'tsoa'
import { createFeatures } from '../domain/features'
import { EtablissementRepository } from '../domain/spi'
import { EstablishmentNotFoundError, Etablissement, SiretNotValidError } from '../domain/types'
import { requestSireneAPI } from '../infrastructure/sirene-API'

/**
 * Defines how to access external services.
 * Uses the "Repository" pattern, see README.md
 */
const etablissementRepository: EtablissementRepository = {
  getEtablissementBySiret: async (siret: string) =>
    requestSireneAPI(siret, process.env['SIRENE_API_TOKEN'] || '')
}

interface ErrorJSON {
  message: string
}

interface ValidateErrorJSON {
  message: 'Validation failed'
  details: { [name: string]: unknown }
}

@Route('health')
export class HealthController extends Controller {
  /**
   * Check the API's health
   */
  @Get()
  public async health(): Promise<string> {
    this.setStatus(200)
    return 'OK'
  }
}

interface SiretBody {
  siret: string
}

@SuccessResponse('200', 'OK')
@Route('insee')
export class SireneController extends Controller {
  /**
   * Retrieves information of an Establishment ("Établissement").
   * Supply the SIRET and receive the corresponding establishment details.
   */
  @Post('get_by_siret')
  public async health(
    @Body() requestBody: SiretBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, ErrorJSON>
  ): Promise<Etablissement> {
    const requestedSiret = requestBody.siret

    const feat = createFeatures(etablissementRepository)
    const etablissementResult = await feat.fetchEtablissement(requestedSiret)

    if (etablissementResult.isErr) {
      const err = etablissementResult.error

      if (err instanceof SiretNotValidError) {
        return validationFailedResponse(422, {
          message: 'Validation failed',
          details: { cause: err.message }
        })
      }

      if (err instanceof EstablishmentNotFoundError) {
        return notFoundResponse(404, { message: 'Establishment not found' })
      }

      return requestFailedResponse(500, { message: `Server internal error` })
    }

    const etablissement = etablissementResult.value
    return etablissement
  }
}
