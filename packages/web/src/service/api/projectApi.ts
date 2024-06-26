/* eslint-disable @typescript-eslint/no-unsafe-call */

import RequestApi from '@/service/api/requestApi'
import type { QuestionnaireData } from '@/types'
import { Project } from '@tee/common/src/project/types'

export default class ProjectApi extends RequestApi<Project> {
  protected readonly url = '/api/projects'
  protected query: string = ''

  constructor(private questionnaireData: QuestionnaireData = {}) {
    super()
    this.query = this.buildQuery
  }

  getOne(id: string) {
    // TO DO : api to get projects when backend is ready
    const url: string = this.url + '/' + id
    console.log('REQUESTED URL', url)
  }

  get buildQuery(): string {
    const queryString: { [key: string]: string } = {}
    Object.entries(this.questionnaireData).forEach(([key, value]: [string, string | string[] | undefined | null]) => {
      if (value !== undefined && value !== null) {
        queryString[key] = value.toString()
      }
    })

    return new URLSearchParams(queryString).toString()
  }
}
