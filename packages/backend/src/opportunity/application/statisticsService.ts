import { Result } from 'true-myth'
import { Statistics } from '../domain/types'
import StatisticsFeatures from '../domain/statisticsFeatures'
import { brevoRepository } from '../infrastructure/api/brevo/brevoDeal'


export default class StatisticsService {
  public async get(): Promise<Result<Statistics, Error>> {
    return await new StatisticsFeatures(brevoRepository).computeStatistics()
  }

}
