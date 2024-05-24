import { Controller, Example, Res, Route, SuccessResponse, TsoaResponse, Get } from 'tsoa'
import { ErrorJSON } from '../../common/controller/jsonError'
import OpportunityInjector from '../application/opportunityService'
import ProgramService from '../../program/application/programService'

@SuccessResponse('200', 'OK')
@Route('test')
export class StatisticsPDETestController extends Controller {
  /**
   * Ping PDE
   *
   * @summary Used to test the PDE api
   */
  @Example<number>(45679)
  @Get()
  public async test(@Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>): Promise<number> {
    const opportunityResult = await new OpportunityInjector().getPDELandingID()
    const programId = new ProgramService().getObjectives('retrofit-electrique')
    if (opportunityResult.isErr) {
      const err = opportunityResult.error

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
    }

    return opportunityResult.value + programId.length
  }
}
