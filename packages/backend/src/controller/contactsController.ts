import { Body, Controller, Post, Route, SuccessResponse, TsoaResponse, Res, Example } from 'tsoa'
import { createContactFeatures } from '../domain/features'
import { ContactInfoRepository } from '../domain/spi'
import { ServiceNotFoundError, ContactInfoBodyAttributes, ContactId } from '../domain/types'
import { addBrevoContact } from '../infrastructure/brevo-API'
import { ErrorJSON, ValidateErrorJSON } from './types'

/**
 * Defines how to access external data services.
 * Uses the "Repository" pattern, see README.md
 */
const brevoRepository: ContactInfoRepository = {
  add: addBrevoContact
}

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

  @Example<ContactId>({
    id: 42
  })
  @Post()
  public async health(
    @Body() requestBody: ContactInfoBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, ServiceNotFoundErrorJSON>
  ): Promise<ContactId> {
    const bodyEmail = requestBody.email
    const bodyAttributes = requestBody.attributes

    const feat = createContactFeatures(brevoRepository)
    const contactInfoResult = await feat.postNewContact(bodyEmail, bodyAttributes)

    if (contactInfoResult.isErr) {
      const err = contactInfoResult.error

      if (err instanceof ServiceNotFoundError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return notFoundResponse(404, {
          message: 'Contact not created'
        })
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return requestFailedResponse(500, {
        message: `Server internal error`
      })
    }

    return contactInfoResult.value
  }
}
