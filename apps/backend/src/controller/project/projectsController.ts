import { ErrorJSON, Monitor, ProjectService } from '@tee/backend-ddd'
import { Controller, Get, Queries, Res, Route, SuccessResponse, Tags, TsoaResponse } from 'tsoa'
import { ProjectFilterQuery } from '@tee/common'
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
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ): Promise<Project[]> {
    const projectResults = new ProjectService().getFiltered(filterData)

    if (projectResults.isErr) {
      const err = projectResults.error
      Monitor.error('Error in ProjetFilter', { error: err })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
    }

    return projectResults.value
  }
}
