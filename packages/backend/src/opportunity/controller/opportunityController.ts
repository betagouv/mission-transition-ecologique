import { OpportunityId, Opportunity } from '../domain/types'
import { Body, Controller, Example, Post, Res, Route, SuccessResponse, TsoaResponse } from 'tsoa'
import { ErrorJSON, ValidateErrorJSON } from '../../common/controller/jsonError'
import { Err } from 'true-myth/dist/es/result'
import ServiceNotFoundError from '../../common/domain/api/serviceNotFoundError'
import OpportunityService from '../application/opportunityService'

interface OpportunityBody {
  opportunity: Opportunity
  optIn: boolean
}

@SuccessResponse('200', 'OK')
@Route('opportunities')
export class OpportunityController extends Controller {
  /**
   * Create an opportunity of a company interested in a given program.
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
    const opportunityResult = await new OpportunityService().createOpportunity(requestBody.opportunity, requestBody.optIn)

    if (opportunityResult.isErr) {
      this.getErrorResponseFromOpportunity(opportunityResult, notFoundResponse, requestFailedResponse)

      return
    }

    return opportunityResult.value
  }

  private getErrorResponseFromOpportunity(
    opportunityResult: Err<OpportunityId, Error>,
    notFoundResponse: TsoaResponse<404, ErrorJSON>,
    requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ) {
    const err = opportunityResult.error

    if (err instanceof ServiceNotFoundError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return notFoundResponse(404, { message: `Opportunity not created: ${err.message}` })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
  }
}
