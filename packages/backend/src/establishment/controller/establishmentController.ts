import { Body, Controller, Post, Route, SuccessResponse, TsoaResponse, Res, Example } from 'tsoa'
import EstablishmentService from '../application/establishmentService'
import { EstablishmentNotFoundError, EstablishmentDetails, Siret } from '../domain/types'
import { ErrorJSON, ValidateErrorJSON } from '../../common/controller/jsonError'

interface EstablishmentNotFoundErrorJSON {
  message: 'Establishment not found'
}

interface SiretBody {
  /**
   * @pattern ^\d{14}$ SIRET should be made of 14 digits
   */
  siret: Siret
}

const exampleEstablishment = {
  siren: '830141321',
  nic: '00034',
  siret: '83014132100034',
  creationDate: '2021-12-01',
  denomination: 'MULTI',
  nafCode: '62.01Z',
  address: {
    streetNumber: '116',
    streetType: 'RUE',
    streetLabel: 'DALAYRAC',
    zipCode: '94120',
    cityLabel: 'FONTENAY-SOUS-BOIS',
    cityCode: '94033'
  }
}

@SuccessResponse('200', 'OK')
@Route('insee')
export class SireneController extends Controller {
  /**
   * Retrieves information of an Establishment ("Établissement").
   * Supply the SIRET and receive the corresponding establishment details.
   *
   * @summary Retrieves information of an "Établissement"
   *
   * @example requestBody: {"siret": "83014132100034"}
   */

  @Example<EstablishmentDetails>(exampleEstablishment)
  @Post('get_by_siret')
  public async getEstablishmentBySiret(
    @Body() requestBody: SiretBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, EstablishmentNotFoundErrorJSON>
  ): Promise<EstablishmentDetails> {
    const requestedSiret = requestBody.siret

    const establishmentResult = await new EstablishmentService().getBySiret(requestedSiret)

    if (establishmentResult.isErr) {
      const err = establishmentResult.error

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
