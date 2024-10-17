import RequestApi from '@/service/api/requestApi'
import type { Project, ProjectFilterQuery, QuestionnaireData } from '@/types'
import { projects } from '@tee/data/static'
import { Result } from 'true-myth'

export default class ProjectApi extends RequestApi {
  protected override readonly url = '/api/projects'

  constructor() {
    super()
  }

  buildQuery(payload: ProjectFilterQuery): string {
    const queryString: { [key: string]: string } = {}
    Object.entries(payload).forEach(([key, value]: [string, string | string[] | undefined | null]) => {
      if (value !== undefined && value !== null) {
        queryString[key] = value.toString()
      }
    })
    return new URLSearchParams(queryString).toString()
  }

  async getFiltered(questionnaireData: QuestionnaireData): Promise<Result<Project[], Error>> {
    const { codeNAF1, sector } = questionnaireData
    const filteredData: ProjectFilterQuery = {
      ...(codeNAF1 && { codeNAF1 }),
      ...(sector && { sector })
    }

    this.query = this.buildQuery(filteredData)
    return super.getJson<Project[]>()
  }

  async get(): Promise<Result<Project[], Error>> {
    //TODO replace with api call once the endpoint is available
    return new Promise((resolve, reject) => {
      if (!projects) reject(new Error('No project data'))
      else resolve(Result.ok(projects))
    })
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
