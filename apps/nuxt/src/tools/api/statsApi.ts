import RequestApi from '@/tools/api/requestApi'
import { StatsData } from '@tee/common'

export default class StatsApi extends RequestApi {
  protected readonly url = '/api/statistics'

  async get() {
    return this.getJson<StatsData>()
  }
}
