import { Controller, Get, Queries, Route, SuccessResponse } from 'tsoa'
import ProgramService from '../application/programService'
import { OpenAPISafeProgram } from './types'

interface QueryParams {
  code_Naf?: string
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
  public async get(@Queries() _queryParams: QueryParams): Promise<OpenAPISafeProgram[]> {
    this.setStatus(200)

    programsResult = new ProgramService().getFilteredPrograms()

    return
  }
}
