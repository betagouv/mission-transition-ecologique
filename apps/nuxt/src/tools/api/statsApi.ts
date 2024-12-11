import RequestApi from '@/tools/api/requestApi'
import { StatsData } from '@tee/common'
import { Result } from 'true-myth'

export default class StatApi extends RequestApi {
  protected readonly url = '/api/statistics'

  async get(): Promise<Result<StatsData, Error>> {
    return this.getJson<StatsData>()
  }
}
