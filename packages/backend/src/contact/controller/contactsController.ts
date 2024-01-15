import { Body, Controller, Example, Post, Res, Route, SuccessResponse, TsoaResponse } from 'tsoa'
import { ContactInfoBodyAttributes } from '../domain/types'
import { ErrorJSON, ValidateErrorJSON } from '../../common/controller/jsonError'
import ContactService from '../application/contactService'
import { Err } from 'true-myth/dist/es/result'
import { ContactId } from '../../common/domain/types'
import ServiceNotFoundError from '../../common/domain/api/serviceNotFoundError'

interface ServiceNotFoundErrorJSON {
  message: 'Contact not created'
}

interface ContactInfoBody {
  email: string
  attributes: ContactInfoBodyAttributes
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
   * @example requestBody: {"email": "contact@multi.coop", "attributes": { "NOM": "Dupont", "PRENOM": "Camille", "TEL" : "0605040302", "SIRET": "83014132100034", "OPT_IN": true }}
   */
  @Example<ContactId>({ id: 42 })
  @Post()
  public async post(
    @Body() requestBody: ContactInfoBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, ServiceNotFoundErrorJSON>
  ): Promise<ContactId | void> {
    const bodyEmail = requestBody.email
    const bodyAttributes = requestBody.attributes

    const contactInfoResult = await new ContactService().create(bodyEmail, bodyAttributes)

    if (contactInfoResult.isErr) {
      this.getErrorResponseFromContact(contactInfoResult, notFoundResponse, requestFailedResponse)

      return
    }

    return contactInfoResult.value
  }

  private getErrorResponseFromContact(
    contactInfoResult: Err<ContactId, Error>,
    notFoundResponse: TsoaResponse<404, ServiceNotFoundErrorJSON>,
    requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ) {
    const err = contactInfoResult.error

    if (err instanceof ServiceNotFoundError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return notFoundResponse(404, { message: 'Contact not created' })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return requestFailedResponse(500, { message: `Server internal error` })
  }
}
