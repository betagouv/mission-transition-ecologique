import RequestApi from '@/tools/api/requestApi'
import { ResultApi } from '@/tools/api/resultApi'
import type { Project, ProjectFilterQuery } from '@/types'

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

  async getOne(slug: string): Promise<ResultApi<Project>> {
    return super.getJson<Project>(this.url + '/' + slug)
  }
}
