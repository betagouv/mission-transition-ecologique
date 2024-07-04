import RequestApi from '@/service/api/requestApi'
import type { Project, QuestionnaireData } from '@/types'
import { projects } from '@tee/data/static'
import { Result } from 'true-myth'

export default class ProjectApi extends RequestApi {
  protected override readonly url = '/api/projects'

  constructor(private questionnaireData: QuestionnaireData = {}) {
    super()
  }

  async get(): Promise<Result<Project[], Error>> {
    //TODO replace with api call once the endpoint is available
    return new Promise((resolve, reject) => {
      if (!projects) reject(new Error('No project data'))
      else resolve(Result.ok(projects as unknown as Project[]))
    })
  }

  getOne(id: string) {
    // TO DO : api to get projects when backend is ready
    const url: string = this.url + '/' + id
    console.log('REQUESTED URL', url)
  }
}
