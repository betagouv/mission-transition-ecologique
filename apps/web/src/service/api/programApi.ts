import RequestApi from '@/service/api/requestApi'
import type { ProgramData, QuestionnaireData } from '@/types'
import { Result } from 'true-myth'

export default class ProgramApi extends RequestApi {
  protected readonly url = '/api/programs'

  constructor(private questionnaireData: QuestionnaireData = {}) {
    super()
    this.query = this.buildQuery
  }

  async get(): Promise<Result<ProgramData[], Error>> {
    return super.getJson<ProgramData[]>()
  }

  async getOne(id: string): Promise<Result<ProgramData, Error>> {
    return super.getJson<ProgramData>(this.url + '/' + id)
  }

  get buildQuery(): string {
    const queryString: { [key: string]: string } = {}
    Object.entries(this.questionnaireData).forEach(([key, value]: [string, string | string[] | undefined | null]) => {
      if (value !== undefined && value !== null) {
        if (this.isValidQueryParam(key)) {
          queryString[key] = value.toString()
        }
      }
    })
    return new URLSearchParams(queryString).toString()
  }

  isValidQueryParam(key: string) {
    return key !== 'priority_objective'
  }
}
