import RequestApi from '@/service/api/requestApi'
import type { ProgramData, QuestionnaireData } from '@/types'
import { Result } from 'true-myth'

export default class ProgramApi extends RequestApi {
  private readonly url = '/api/programs'

  constructor(private questionnaireData: QuestionnaireData = {}) {
    super()
  }

  async get(): Promise<Result<ProgramData[], Error>> {
    const url: string = this.url + '?' + this.query

    try {
      const response = await fetch(url)
      return Result.ok((await response.json()) as ProgramData[])
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
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

  get query(): string {
    const queryString: { [key: string]: string } = {}
    Object.entries(this.questionnaireData).forEach(([key, value]) => {
      let stringValue: string
      if (value !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        stringValue = value.toString()
      } else {
        stringValue = ''
      }
      queryString[key] = stringValue
    })

    return new URLSearchParams(queryString).toString()
  }
}
