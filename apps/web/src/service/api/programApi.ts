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
    const url: string = this.url + '/' + id
    try {
      const response = await fetch(url)
      if (response.status === 404) {
        throw new Error('Program not found')
      }
      return Result.ok((await response.json()) as ProgramData)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
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
