import { Controller, Get, Path, Queries, Res, Route, SuccessResponse, TsoaResponse } from 'tsoa'
import { OpenAPISafeProgram } from './types'
import { Err } from 'true-myth/dist/es/result'
import { QuestionnaireData } from '@tee/common'
import { ErrorJSON, Monitor, ProgramService } from '@tee/backend-ddd'

interface PaginatedQuery extends QuestionnaireData {
  pageSize?: number
  page?: number
}

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
  public getPrograms(
    @Queries() queryParams: PaginatedQuery,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ): OpenAPISafeProgram[] | void {
    const programService = new ProgramService()
    this.setStatus(200)

    let programsResult
    queryParams.page = 1 // TODO delete before putting it on prod.
    if (!queryParams.page) {
      programsResult = programService.getFilteredPrograms(queryParams as QuestionnaireData)
    } else {
      programsResult = programService.getPaginatedPrograms(queryParams as QuestionnaireData, queryParams.page, queryParams.pageSize || 10)
    }

    if (programsResult.isErr) {
      Monitor.error('Error in get programs', { queryParams, error: programsResult.error })
      this.throwErrorResponse(programsResult, requestFailedResponse)
      return
    }

    return programsResult.value
  }

  /**
   * Get programs, filtered given input data, and sorted by relevance.
   *
   * If no questionnaire data are providing, returns all programs.
   *
   * @summary Get relevant programs given input data
   */
  @Get('{programId}')
  public getOneProgram(@Path() programId: string, @Res() notFoundResponse: TsoaResponse<404, ErrorJSON>): OpenAPISafeProgram {
    this.setStatus(200)

    const program = new ProgramService().getById(programId)

    if (!program) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      Monitor.error('Error in get Program id', { programId })
      return notFoundResponse(404, { message: `Program with id "${programId}" could not be found` })
    }

    return program
  }

  private throwErrorResponse(programsResult: Err<OpenAPISafeProgram[], Error>, requestFailedResponse: TsoaResponse<500, ErrorJSON>) {
    const err = programsResult.error

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
  }
}
