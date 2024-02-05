import { Controller, Get, Queries, Route, SuccessResponse } from 'tsoa'

interface QueryParams {
  code_Naf?: string
}

interface Program {
  a: string[]
}

@SuccessResponse('200', 'OK')
@Route('programs')
export class ProgramsController extends Controller {
  /**
   * Get programs, filtered given input data, and sorted by relevance.
   *
   * If questionnaire data (query parameters) are missing, returns all programs.
   *
   * @summary Get relevant programs given input data
   */
  // @Example<Program>({})
  @Get()
  public async get(@Queries() _queryParams: QueryParams): Promise<Program> {
    this.setStatus(200)
    this.setHeader('Content-Type', 'text/plain')
    return Promise.resolve({} as Program)
  }
}
