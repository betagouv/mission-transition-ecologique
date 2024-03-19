import RequestApi from '@/service/api/requestApi'
import type { ProgramData, QuestionnaireData } from '@/types'

export default class ProgramApi extends RequestApi {
  private readonly url = '/api/programs'

  constructor(private questionnaireData: QuestionnaireData) {
    super()
  }

  async fetch() {
    const url: string = this.url + '?' + this.query
    const response = await fetch(url)

    return (await response.json()) as ProgramData[]
  }

  get query(): string {
    return new URLSearchParams(this.questionnaireData).toString()
  }
}
