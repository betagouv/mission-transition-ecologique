import { OpportunityId, Opportunity } from '../domain/types'
import { Body, Controller, Example, Post, Res, Route, SuccessResponse, TsoaResponse } from 'tsoa'
import { ErrorJSON, ValidateErrorJSON } from '../../common/controller/jsonError'
import { Err } from 'true-myth/dist/es/result'
import ServiceNotFoundError from '../../common/domain/api/serviceNotFoundError'
import ContactService from '../application/contactService'

interface OpportunityBody {
  opportunity: Opportunity
  optIn: boolean
}

@SuccessResponse('200', 'OK')
@Route('contacts')
export class ContactController extends Controller {
  /**
   * Add a new contact to TEE's Brevo service.
   * Supply the email, the listId, and some attributes and receive the id of the contact created.
   *
   * @summary Adds a new contact to our Brevo list
   *
   * @example requestBody: {"opportunity": {"name": "Dupont", "forname": "Camille", "email": "contact@multi.coop", "phone": "0605040302",
   * "siret": "83014132100034", "programId": "test-program", "message": "Bonjour !"}, "optIn": true}
   */
  @Example<OpportunityId>({ id: '42' })
  @Post()
  public async post(
    @Body() requestBody: OpportunityBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, ErrorJSON>
  ): Promise<OpportunityId | void> {
    const dealResult = await new ContactService().createOpportunity(requestBody.opportunity, requestBody.optIn)

    if (dealResult.isErr) {
      this.getErrorResponseFromContact(dealResult, notFoundResponse, requestFailedResponse)

      return
    }

    return dealResult.value
  }

  private getErrorResponseFromContact(
    contactInfoResult: Err<OpportunityId, Error>,
    notFoundResponse: TsoaResponse<404, ErrorJSON>,
    requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ) {
    const err = contactInfoResult.error

    if (err instanceof ServiceNotFoundError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return notFoundResponse(404, { message: `Opportunity not created: ${err.message}` })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
  }
}
