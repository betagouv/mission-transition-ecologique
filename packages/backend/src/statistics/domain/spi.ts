import type { Result } from 'true-myth'
import StatsData from '@tee/common/src/stats/types'

export type StatisticsRepository = {
  get: () => Promise<Result<StatsData, Error>>
}
