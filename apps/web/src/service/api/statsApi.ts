import RequestApi from '@/service/api/requestApi'
<<<<<<< HEAD:packages/web/src/service/api/statsApi.ts
import type StatsData from '@tee/common/src/stats/types'
=======
import { Result } from 'true-myth'
import { StatsData } from '@tee/common'
>>>>>>> origin/release/project:apps/web/src/service/api/statsApi.ts

export default class StatApi extends RequestApi<StatsData> {
  protected readonly url = '/api/statistics'
}
