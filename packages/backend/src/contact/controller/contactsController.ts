import { ContactInfoBodyAttributes, ServiceNotFoundError, DealId, Opportunity } from '../domain/types'
import { Body, Controller, Example, Post, Res, Route, SuccessResponse, TsoaResponse } from 'tsoa'
import { ErrorJSON, ValidateErrorJSON } from '../../common/jsonError'
import ContactService from '../application/contactService'
import { postNewOpportunity } from '../application/postNewOpportunity'
import { Err } from 'true-myth/dist/es/result'
import OperatorService from '../../operator/application/operatorService'
import ProgramService from '../../program/application/programService'
import { ContactId } from '../../common/domain/types'

interface ContactInfoBody {
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
  @Example<DealId>({ id: '42' })
  @Post()
  public async post(
    @Body() requestBody: ContactInfoBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, ErrorJSON>,
    @Res() missingOptInResponse: TsoaResponse<422, ErrorJSON>
  ): Promise<DealId | void> {
    if (!requestBody.optIn) return missingOptInResponse(422, { message: 'opt-in is required for storing contact data' })

    const dealResult = await postNewOpportunity(requestBody.opportunity, requestBody.optIn)

    if (dealResult.isErr) {
      this.getErrorResponseFromContact(dealResult, notFoundResponse, requestFailedResponse)

      return
    }

    const program = new ProgramService().getById(requestBody.opportunity.programId)
    if (program) {
      const operatorResult = await new OperatorService().create({ email: bodyEmail, attributes: bodyAttributes }, program)
      if (false !== operatorResult) {
        const contactUpdateResult = await new ContactService().update(dealResult.value, { BPI_FRANCE: operatorResult.isOk })
        if (contactUpdateResult.isErr) {
          // TODO: Send an email to the admin
        }
      }
    }

    return dealResult.value
  }

  private getErrorResponseFromContact(
    contactInfoResult: Err<ContactId, Error>,
    notFoundResponse: TsoaResponse<404, ErrorJSON>,
    requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ) {
    const err = contactInfoResult.error

    if (err instanceof ServiceNotFoundError) {
      return notFoundResponse(404, { message: 'Contact not created' })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return requestFailedResponse(500, { message: `Server internal error` })
  }
}
