import RequestApi from '@/service/api/requestApi'
import { Result } from 'true-myth'
import type StatsData from '@tee/common/src/stats/types'

export default class StatApi extends RequestApi {
  private readonly url = '/api/statistics'

  async get(): Promise<Result<StatsData, Error>> {
    const url: string = this.url
    try {
      const response = await fetch(url)
      return Result.ok((await response.json()) as StatsData)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }
}
