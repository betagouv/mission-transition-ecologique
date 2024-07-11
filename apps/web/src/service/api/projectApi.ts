import RequestApi from '@/service/api/requestApi'
import { Result } from 'true-myth'
import { Project } from '@tee/data'
import { projects } from '@tee/data/static'

export default class ProjectApi extends RequestApi<Project> {
  protected readonly url = '/api/projects'

  constructor() {
    super()
  }

  async get(): Promise<Result<Project[], Error>> {
    //TODO replace with api call once the endpoint is available
    return new Promise((resolve, reject) => {
      if (!projects) reject(new Error('No project data'))
      else resolve(Result.ok(projects as unknown as Project[]))
    })
  }
}
