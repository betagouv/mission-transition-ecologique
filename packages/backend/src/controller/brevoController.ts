import {
  Body,
  Controller,
  // Get,
  Post,
  Route,
  SuccessResponse,
  TsoaResponse,
  Res,
  Example,
  // Produces
} from 'tsoa'
import { createContact } from '../domain/features'
import { BrevoRepository } from '../domain/spi'
import { BrevoNotFoundError, BrevoResponse } from '../domain/types'
import { requestBrevoAPI } from '../infrastructure/brevo-API'

/**
 * Defines how to access external services.
 * Uses the "Repository" pattern, see README.md
 */
const brevoRepository: BrevoRepository = {
  postNewContact: async (email, listIds, attributes) => 
  requestBrevoAPI(process.env['BREVO_API_TOKEN'] || '', email, listIds, attributes)
}

interface ErrorJSON {
  message: string
}

interface BrevoNotFoundErrorJSON {
  message: 'Contact not created'
}

interface ValidateErrorJSON {
  message: 'Validation failed'
  details: { [name: string]: unknown }
}

interface BrevoBody {
  email: string,
  listIds: number[],
  attributes: object
}

const exampleBrevoResponse = {
  id: 42
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
   * @example requestBody: {"email": "contact@multi.coop", "listId": [4], "attributes": {}}
   */

  @Example<BrevoResponse>(exampleBrevoResponse)
  @Post('post_brevo_form')
  public async health(
    @Body() requestBody: BrevoBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, BrevoNotFoundErrorJSON>
  ): Promise<BrevoResponse> {
    const bodyEmail = requestBody.email
    const bodyListIds = requestBody.listIds
    const bodyAttributes = requestBody.attributes

    const feat = createContact(brevoRepository)
    const brevoResult = await feat.postNewContact(bodyEmail, bodyListIds, bodyAttributes)

    if (brevoResult.isErr) {
      const err = brevoResult.error

      if (err instanceof BrevoNotFoundError) {
        return notFoundResponse(404, { message: 'Contact not created' })
      }

      return requestFailedResponse(500, { message: `Server internal error` })
    }

    const brevo = brevoResult.value
    return brevo
  }
}
