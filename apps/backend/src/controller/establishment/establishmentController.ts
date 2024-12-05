import { Controller, Route, SuccessResponse, TsoaResponse, Res, Example, Get, Path, Query, Tags } from 'tsoa'
import { ErrorJSON, EstablishmentNotFoundError, EstablishmentService, ValidateErrorJSON, Monitor } from '@tee/backend-ddd'
import { EstablishmentFront, EstablishmentSearch, StructureSize, CompanyActivityType } from '@tee/common'

interface EstablishmentNotFoundErrorJSON {
  message: 'Establishment not found'
}

/**
 * @pattern ^\d{14}$ SIRET should be made of 14 digits
 */
export type Siret = string

const exampleEstablishment = {
  codeNAF: '62.01Z',
  codeNAF1: 'A',
  ville: 'DALAYRAC',
  codePostal: '94120',
  legalCategory: '5710',
  region: 'Île-de-France',
  structure_size: StructureSize.TPE,
  denomination: 'MULTI',
  secteur: 'Programmation informatique',
  creationDate: '2021-12-01',
  siret: '83014132100034'
}

@SuccessResponse('200', 'OK')
@Route('establishments')
@Tags('establishments')
export class SireneController extends Controller {
  /**
   * Search NAF infos
   * @param queryText - sector or naf code
   * @returns results of naf infos
   */
  @Get('/searchNAF')
  public async searchNAF(
    @Query() queryText: string,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ): Promise<CompanyActivityType[]> {
    try {
      return new EstablishmentService().searchNAF(queryText)
    } catch (error) {
      console.error('Error in searchNAF', error)
      return requestFailedResponse(500, { message: 'Failed to fetch search results.' })
    }
  }
  /**
   * Retrieve establishments informations used in front end
   * for a single establishment using the SIRENE API if search by SIRET
   * or for up to 9 establishments using the Recherche-entreprise API otherwise.
   * Also return the number of matches found
   *
   * @summary Search for establishments from a query
   *
   * @example requestBody: {"string": "siret, nom, adresse..."}
   */

  @Example<EstablishmentFront>(exampleEstablishment)
  @Get('{query}')
  public async getEstablishmentBySiret(
    @Path() query: string,
    @Query() resultCount = 3,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, EstablishmentNotFoundErrorJSON>
  ): Promise<EstablishmentSearch> {
    const establishmentResult = await new EstablishmentService().search(query, resultCount)

    if (establishmentResult.isErr) {
      const err = establishmentResult.error
      Monitor.error('Error in getEstablishmentBySiret', { query, error: err })

      if (err instanceof EstablishmentNotFoundError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return notFoundResponse(404, { message: 'Establishment not found' })
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return requestFailedResponse(500, { message: `Server internal error` })
    }

    return establishmentResult.value
  }
}
