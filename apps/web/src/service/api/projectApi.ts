import RequestApi from '@/service/api/requestApi'
import type { Project, ProjectFilterQuery } from '@/types'
import { projects } from '@tee/data/static'
import { Result } from 'true-myth'

export default class ProjectApi extends RequestApi {
  protected override readonly url = '/api/projects'

  constructor(private _projectFilterQuery: ProjectFilterQuery = {}) {
    super()
    this.query = this.buildQuery
  }

  get buildQuery(): string {
    const queryString: { [key: string]: string } = {}
    Object.entries(this._projectFilterQuery).forEach(([key, value]: [string, string | string[] | undefined | null]) => {
      if (value !== undefined && value !== null) {
        queryString[key] = value.toString()
      }
    })
    return new URLSearchParams(queryString).toString()
  }

  async get(): Promise<Result<Project[], Error>> {
    return super.getJson<Project[]>()
  }

  async getOne(slug: string): Promise<Result<Project, Error>> {
    // TO DO : api to get projects when backend is ready
    // const url: string = this.url + '/' + slug
    const project = projects.find((project) => project.slug === slug)
    if (project) {
      return Result.ok(project)
    }

    return Result.err(new Error('Project not found'))
  }
}
