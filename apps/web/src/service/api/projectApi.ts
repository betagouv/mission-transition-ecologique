import RequestApi from '@/service/api/requestApi'
import type { Project, QuestionnaireData } from '@/types'
import { projects } from '@tee/data/static'
import { Result } from 'true-myth'
import { Project } from '@tee/data'
import { projects } from '@tee/data/static'

export default class ProjectApi extends RequestApi {
  protected override readonly url = '/api/projects'

  constructor() {
    super()
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
