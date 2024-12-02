import RequestApi from '@/tools/api/requestApi'
import { ResultApi } from '@/tools/api/resultApi'
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

  async get(): Promise<ResultApi<Project[]>> {
    return super.getJson<Project[]>()
  }

  async getOne(slug: string): Promise<Result<Project, Error>> {
    // TO DO : api to get projects when backend is ready
    // const url: string = this.url + '/' + slug
    const { data: project } = await useAsyncData(`project-id-${slug}`, async () => {
      return projects.find((project) => project.slug === slug)
    })

    if (project.value) {
      return Result.ok(project.value)
    }

    return Result.err(new Error('Project not found'))
  }
}
