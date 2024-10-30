import { Controller, Get, Path, Queries, Res, Route, SuccessResponse, TsoaResponse } from 'tsoa'
import { OpenAPISafeProgram } from './types'
import { QuestionnaireData } from '@tee/common'
import { ErrorJSON, Monitor, ProgramErrorType, ProgramService } from '@tee/backend-ddd'
@SuccessResponse('200', 'OK')
@Route('programs')
export class ProgramsController extends Controller {
  /**
   * Get programs, filtered given input data, and sorted by relevance.
   *
   * If no questionnaire data are providing, returns all programs.
   *
   * @summary Get relevant programs given input data
   */
  @Get()
  public get(
    @Queries() questionnaireData: QuestionnaireData,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ): OpenAPISafeProgram[] | void {
    const programService = new ProgramService()
    this.setStatus(200)

    const programsResult = programService.getFilteredPrograms(questionnaireData)

    if (programsResult.isErr) {
      Monitor.error('Error in get programs', { questionnaireData, error: programsResult.error })
      this.throwErrorResponse(programsResult.error, requestFailedResponse)
      return
    }

    return programsResult.value.map((program) => programService.convertDomainToFront(program))
  }

  /**
   * Get programs, filtered given input data, and sorted by relevance.
   *
   * If no questionnaire data are providing, returns all programs.
   *
   * @summary Get relevant programs given input data
   */
  @Get('{programId}')
  public getOne(
    @Path() programId: string,
    @Queries() questionnaireData: QuestionnaireData,
    @Res() notFoundResponse: TsoaResponse<404, ErrorJSON>,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ): OpenAPISafeProgram | void {
    this.setStatus(200)
    const programService = new ProgramService()
    const program = programService.getOneWithMaybeEligibility(programId, questionnaireData)

    if (program.isErr) {
      if (program.error.message === ProgramErrorType.UnknownId) {
        Monitor.warning('Unknownn Program id', { programId })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return notFoundResponse(404, { message: `Program not found` })
      }
      Monitor.error('Error in get Program id', { programId })
      this.throwErrorResponse(program.error, requestFailedResponse)
      return
    }

    return programService.convertDomainToFront(program.value)
  }

  private throwErrorResponse(error: Error, requestFailedResponse: TsoaResponse<500, ErrorJSON>) {
    const err = error

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
  }
}
