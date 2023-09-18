import { Body, Controller, Post, Route, SuccessResponse, TsoaResponse, Res, Example } from 'tsoa'
import { createContactFeatures } from '../domain/features'
import { ContactInfoRepository } from '../domain/spi'
import { ServiceNotFoundError, ContactInfoBodyAttributes, ContactId } from '../domain/types'
import { requestBrevoAPI } from '../infrastructure/brevo-API'
import { ErrorJSON, ValidateErrorJSON } from './types'

const rawlistIds: string[] = process.env['BREVO_LIST_IDS']?.split(',') || ['4']
const listIds: number[] = rawlistIds.map((id) => parseInt(id))

/**
 * Defines how to access external data services.
 * Uses the "Repository" pattern, see README.md
 */
const brevoRepository: ContactInfoRepository = {
  add: async (email, attributes) =>
    requestBrevoAPI(process.env['BREVO_API_TOKEN'] || '', email, listIds, attributes)
}

interface ServiceNotFoundErrorJSON {
  message: 'Contact not created'
}

interface ContactInfoBody {
  email: string
  attributes: ContactInfoBodyAttributes
}

@SuccessResponse('200', 'OK')
@Route('brevo')
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
  @Post('contact-information')
  public async health(
    @Body() requestBody: ContactInfoBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, ServiceNotFoundErrorJSON>
  ): Promise<ContactId> {
    const bodyEmail = requestBody.email
    const bodyAttributes = requestBody.attributes

    const feat = createContactFeatures(brevoRepository)
    const contactInfoResult = await feat.postNewContact(bodyEmail, listIds, bodyAttributes)

    if (contactInfoResult.isErr) {
      const err = contactInfoResult.error

      if (err instanceof ServiceNotFoundError) {
        return notFoundResponse(404, { message: 'Contact not created' })
      }

      return requestFailedResponse(500, { message: `Server internal error` })
    }

    return contactInfoResult.value
  }
}
