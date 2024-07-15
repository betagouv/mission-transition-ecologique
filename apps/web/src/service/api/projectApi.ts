import RequestApi from '@/service/api/requestApi'
import type { Project } from '@/types'
import { projects } from '@tee/data/static'
import { Result } from 'true-myth'

export default class ProjectApi extends RequestApi {
  protected readonly url = '/api/projects'

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
}
