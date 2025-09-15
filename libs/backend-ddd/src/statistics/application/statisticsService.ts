import StatisticsFeatures from '../domain/statisticsFeatures'
import { StatOutput, StatQueryParams } from '../domain/types'

export class StatisticsService {
  public async getNorthStarStats(params: StatQueryParams): Promise<StatOutput> {
    return await new StatisticsFeatures().fetchNorthStarStats(params)
  }
}
