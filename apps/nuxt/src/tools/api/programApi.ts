import RequestApi from '@/tools/api/requestApi'
import type { ProgramData, QuestionnaireData } from '@/types'
import { Result } from 'true-myth'

export default class ProgramApi extends RequestApi {
  protected readonly url = '/api/programs'

  constructor(private questionnaireData: QuestionnaireData = {}) {
    super()
    this.query = this.buildQuery
  }

  async get(): Promise<Result<ProgramData[], Error>> {
    const { data: programsResult } = await useAsyncData(`program-${this.query}`, () => {
      return super.getJson<ProgramData[]>()
    })
    return programsResult.value || Result.err(new Error('Programs not found'))
  }

  async getOne(id: string): Promise<Result<ProgramData, Error>> {
    const { data: programResult } = await useAsyncData(`program-id-${id}`, () => {
      return super.getJson<ProgramData>(this.url + '/' + id)
    })
    return programResult.value || Result.err(new Error('Program not found'))
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
