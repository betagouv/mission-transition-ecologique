import RequestApi from '@/service/api/requestApi'
import { StatsData } from '@tee/common'

export default class StatApi extends RequestApi<StatsData> {
  protected readonly url = '/api/statistics'
}
