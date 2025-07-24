import { StatOutput, StatQueryParams } from '@tee/common'
import StatisticsFeatures from '../domain/statisticsFeatures'

export class StatisticsService {
  public async getNorthStarStats(params: StatQueryParams): Promise<StatOutput> {
    return await new StatisticsFeatures().fetchNorthStarStats(params)
  }
}
