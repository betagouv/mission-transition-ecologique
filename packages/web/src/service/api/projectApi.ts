import RequestApi from '@/service/api/requestApi'
import { Result } from 'true-myth'
import { Project } from '@tee/common/src/project/types'
import projectData from '@tee/data/static/project.json'

export default class ProjectApi extends RequestApi<Project> {
  protected readonly url = '/api/projects'

  async get(): Promise<Result<Project[], Error>> {
    //TODO replace with api call once the endpoint is available
    return new Promise((resolve) => {
      return resolve(projectData)
    })
  }
  async getOne(id: string): Promise<Result<Project, Error>> {
    const url = this.url + '/' + id
    try {
      const response = await fetch(url)
      if (response.status === 404) {
        throw new Error('Project not found')
      }
      return Result.ok((await response.json()) as Project)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }
}
