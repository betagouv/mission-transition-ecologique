import { Controller, Get, Path, Queries, Res, Route, SuccessResponse, TsoaResponse } from 'tsoa'
import { OpenAPISafeProgram } from './types'
import { Err } from 'true-myth/dist/es/result'
import { QuestionnaireData } from '@tee/common'
import { ErrorJSON, Monitor, ProgramService } from '@tee/backend-ddd'
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
      this.throwErrorResponse(programsResult, requestFailedResponse)
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
  public getOne(@Path() programId: string, @Res() notFoundResponse: TsoaResponse<404, ErrorJSON>): OpenAPISafeProgram {
    this.setStatus(200)
    const programService = new ProgramService()
    const program = programService.getById(programId)

    if (!program) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      Monitor.warning('Error in get Program id', { programId })
      return notFoundResponse(404, { message: `Program with id "${programId}" could not be found` })
    }

    return programService.convertDomainToFront(program)
  }

  private throwErrorResponse(programsResult: Err<OpenAPISafeProgram[], Error>, requestFailedResponse: TsoaResponse<500, ErrorJSON>) {
    const err = programsResult.error

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
  }
}
