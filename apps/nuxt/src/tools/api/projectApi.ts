import RequestApi from '@/tools/api/requestApi'
import { ResultApi } from '@/tools/api/resultApi'
import type { ProjectType, ProjectFilterQuery } from '@/types'

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
    const params = new URLSearchParams(queryString)
    params.sort()

    return params.toString()
  }

  async get(): Promise<ResultApi<ProjectType[]>> {
    return await super.getJson<ProjectType[]>()
  }

  async getOne(slug: string): Promise<ResultApi<ProjectType>> {
    return await super.getJson<ProjectType>(this.url + '/' + slug)
  }
}