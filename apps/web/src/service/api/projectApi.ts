/* eslint-disable @typescript-eslint/no-unsafe-call */

import RequestApi from '@/service/api/requestApi'
import type { Project, QuestionnaireData } from '@/types'
import projectData from '@tee/data/static/project.json'
import { Result } from 'true-myth'

export default class ProjectApi extends RequestApi<Project> {
  protected override readonly url = '/api/projects'

  constructor(private questionnaireData: QuestionnaireData = {}) {
    super()
  }

  async get(): Promise<Result<Project[], Error>> {
    //TODO replace with api call once the endpoint is available
    return new Promise((resolve, reject) => {
      if (!projectData) reject(new Error('No project data'))
      else resolve(Result.ok(projectData as unknown as Project[]))
    })
  }

  getOne(id: string) {
    // TO DO : api to get projects when backend is ready
    const url: string = this.url + '/' + id
    console.log('REQUESTED URL', url)
  }
}
