import RequestApi from '@/service/api/requestApi'
import type { Project } from '@/types'
// import { projects } from '@tee/data/static'
import { Result } from 'true-myth'

export default class ProjectApi extends RequestApi {
  protected override readonly url = '/api/projects'

  constructor() {
    super()
  }

  async get(): Promise<Result<Project[], Error>> {
    //TODO replace with api call once the endpoint is available
    const { projects } = await import('@tee/data/static')
    if (!projects) {
      return Result.err(new Error('No project data'))
    } else {
      return Result.ok(projects)
    }
  }

  async getOne(slug: string): Promise<Result<Project, Error>> {
    // TO DO : api to get projects when backend is ready
    // const url: string = this.url + '/' + slug
    const { projects } = await import('@tee/data/static')
    const project = projects.find((project) => project.slug === slug)
    if (project) {
      return Result.ok(project)
    }

    return Result.err(new Error('Project not found'))
  }
}
