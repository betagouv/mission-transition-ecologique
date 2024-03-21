import RequestApi from '@/service/api/requestApi'
import type { Program, QuestionnaireData } from '@/types'
import { Result } from 'true-myth'

export default class ProgramApi extends RequestApi {
  private readonly url = '/api/programs'

  constructor(private questionnaireData: QuestionnaireData = {}) {
    super()
  }

  async get(): Promise<Result<Program[], Error>> {
    const url: string = this.url + '?' + this.query

    try {
      const response = await fetch(url)
      return Result.ok((await response.json()) as Program[])
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }

  async getOne(id: string): Promise<Result<Program, Error>> {
    const url: string = this.url + '/' + id
    try {
      const response = await fetch(url)
      if (response.status === 404) {
        throw new Error('Program not found')
      }
      return Result.ok((await response.json()) as Program)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }

  get query(): string {
    return new URLSearchParams(this.questionnaireData).toString()
  }
}
