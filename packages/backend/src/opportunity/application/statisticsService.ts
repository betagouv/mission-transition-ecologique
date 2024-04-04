import { Result } from 'true-myth'
import { Statistics } from '../domain/types'
import StatisticsFeatures from '../domain/statisticsFeatures'

export default class StatisticsService {
  public async get(): Promise<Result<Statistics, Error>> {
    return await new StatisticsFeatures().computeStatistics()
  }
}
