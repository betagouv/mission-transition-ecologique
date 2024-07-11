import RequestApi from '@/service/api/requestApi'
import { StatsData } from '@tee/common'
import { Result } from 'true-myth'

export default class StatApi extends RequestApi<StatsData> {
  protected readonly url = '/api/statistics'

  async getData(): Promise<Result<StatsData, Error>> {
    try {
      const response = await fetch(this.url)
      return Result.ok((await response.json()) as StatsData)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }
}
