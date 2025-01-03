import { ErrorJSON, Monitor, ProjectService, NAF1Letters } from '@tee/backend-ddd'
import { Controller, Get, Queries, Res, Route, SuccessResponse, Tags, TsoaResponse } from 'tsoa'
import { ProjectFilterQuery, Sector } from '@tee/common'
import { Project } from '@tee/data'

@SuccessResponse('200', 'OK')
@Route('projects')
@Tags('projects')
export class ProjectsController extends Controller {
  /**
   * Request Projects
   */
  @Get()
  public async get(
    @Queries() filterData: ProjectFilterQuery,
    @Res() requestFailedResponse: TsoaResponse<400 | 500, ErrorJSON>
  ): Promise<Project[]> {
    if (!this._validateData(filterData)) {
      return requestFailedResponse(400, { message: 'Invalid filter data provided' })
    }

    const projectResults = new ProjectService().getFiltered(filterData)

    if (projectResults.isErr) {
      const err = projectResults.error
      Monitor.error('Error in ProjetFilter', { error: err })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
    }

    return projectResults.value
  }

  private _validateData(filterData: ProjectFilterQuery): boolean {
    if (filterData.codeNAF1 && !NAF1Letters.includes(filterData.codeNAF1)) {
      return false
    }

    const validSectors = Object.values(Sector)
    if (filterData.sector && !validSectors.includes(filterData.sector)) {
      return false
    }

    return true
  }
}
