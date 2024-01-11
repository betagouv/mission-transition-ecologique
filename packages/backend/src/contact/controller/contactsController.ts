import { Body, Controller, Post, Route, SuccessResponse, TsoaResponse, Res, Example } from 'tsoa'
import { ServiceNotFoundError, DealId, Opportunity } from '../domain/types'
import { ErrorJSON, ValidateErrorJSON } from '../../common/jsonError'
import { postNewOpportunity } from '../application/postNewOpportunity'

interface ContactInfoBody {
  opportunity: Opportunity
  optIn: boolean
}

@SuccessResponse('200', 'OK')
@Route('contacts')
export class ContactInfoController extends Controller {
  /**
   * Add a new contact to TEE's Brevo service.
   * Supply the email, the listId, and some attributes and receive the id of the contact created.
   *
   * @summary Adds a new contact to our Brevo list
   *
   * @example requestBody: {"opportunity": {"name": "Dupont", "forname": "Camille", "email": "contact@multi.coop", "phone": "0605040302",
   * "siret": "83014132100034", "programId": "test-program"}, "optIn": true}
   */

  @Example<DealId>({ id: '42' })
  @Post()
  public async health(
    @Body() requestBody: ContactInfoBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, ErrorJSON>,
    @Res() missingOptInResponse: TsoaResponse<422, ErrorJSON>
  ): Promise<DealId> {
    if (!requestBody.optIn) return missingOptInResponse(422, { message: 'opt-in is required for storing contact data' })

    const contactInfoResult = await postNewOpportunity(requestBody.opportunity, requestBody.optIn)

    if (contactInfoResult.isErr) {
      const err = contactInfoResult.error

      if (err instanceof ServiceNotFoundError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return notFoundResponse(404, { message: 'Opportunity not created' })
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return requestFailedResponse(500, { message: 'Server internal error' })
    }

    return contactInfoResult.value
  }
}
