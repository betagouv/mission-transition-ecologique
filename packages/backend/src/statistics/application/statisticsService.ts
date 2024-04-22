import { Result } from 'true-myth'
import StatisticsFeatures from '../domain/statisticsFeatures'
import { brevoRepository } from '../../opportunity/infrastructure/api/brevo/brevoDeal'
import StatsData from '@tee/common/src/stats/types'

export default class StatisticsService {
  public async get(): Promise<Result<StatsData, Error>> {
    return await new StatisticsFeatures(brevoRepository).computeStatistics()
  }
}
