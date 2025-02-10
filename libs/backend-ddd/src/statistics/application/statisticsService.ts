import { Result } from 'true-myth'
import { StatsData } from '@tee/common'
import { ProgramService } from '../../program'
import StatisticsFeatures from '../domain/statisticsFeatures'
import { brevoRepository } from '../../opportunity/infrastructure/api/brevo/brevoDeal'

export class StatisticsService {
  public async get(): Promise<Result<StatsData, Error>> {
    return await new StatisticsFeatures(brevoRepository, new ProgramService()).computeStatistics()
  }

  public generateIframeUrl(): string {
    return new StatisticsFeatures(brevoRepository, new ProgramService()).generateDashboardUrl()
  }
}
