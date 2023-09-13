import { Body, Controller, Post, Route, SuccessResponse, TsoaResponse, Res, Example } from 'tsoa'
import { createContact } from '../domain/features'
import { BrevoRepository } from '../domain/spi'
import { BrevoNotFoundError, BrevoBodyAttributes, BrevoResponse } from '../domain/types'
import { requestBrevoAPI } from '../infrastructure/brevo-API'
import { ErrorJSON, ValidateErrorJSON } from './types'

/**
 * Defines how to access external services.
 * Uses the "Repository" pattern, see README.md
 */
const rawlistIds: string[] = process.env['BREVO_LIST_IDS']?.split(',') || ['4']
const listIds: number[] = rawlistIds.map((id) => parseInt(id))

const brevoRepository: BrevoRepository = {
  postNewContact: async (email, attributes) =>
    requestBrevoAPI(process.env['BREVO_API_TOKEN'] || '', email, listIds, attributes)
}

interface BrevoNotFoundErrorJSON {
  message: 'Contact not created'
}

interface BrevoBody {
  email: string
  attributes: BrevoBodyAttributes
}

@SuccessResponse('200', 'OK')
@Route('brevo')
export class BrevoController extends Controller {
  /**
   * Add a new contact to TEE's Brevo service.
   * Supply the email, the listId, and some attributes and receive the id of the contact created.
   *
   * @summary Adds a new contact to our Brevo list
   *
   * @example requestBody: {"email": "contact@multi.coop", "attributes": { "NOM": "Dupont", "PRENOM": "Camille", "TEL" : "0605040302", "SIRET": "83014132100034", "OPT_IN": true }}
   */

  @Example<BrevoResponse>({ id: 42 })
  @Post('post_brevo_form')
  public async health(
    @Body() requestBody: BrevoBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, BrevoNotFoundErrorJSON>
  ): Promise<BrevoResponse> {
    const bodyEmail = requestBody.email
    const bodyAttributes = requestBody.attributes

    const feat = createContact(brevoRepository)
    const brevoResult = await feat.postNewContact(bodyEmail, listIds, bodyAttributes)

    if (brevoResult.isErr) {
      const err = brevoResult.error

      if (err instanceof BrevoNotFoundError) {
        return notFoundResponse(404, { message: 'Contact not created' })
      }

      return requestFailedResponse(500, { message: `Server internal error` })
    }

    return brevoResult.value
  }
}
