import { Result } from 'true-myth'

import StatsData from '@tee/common/src/stats/types'
import { OpportunityRepository } from './spi'

export default class StatisticsFeatures {
  private readonly _opportunityRepository: OpportunityRepository

  constructor(opportunityRepository: OpportunityRepository) {
    this._opportunityRepository = opportunityRepository
  }

  async computeStatistics(): Promise<Result<StatsData, Error>> {
    await new Promise((res) => setTimeout(res, 100))

    const nOpportunitiesCreated = await this.getOpportunitiesCreated()

    const fakeStatistics: StatsData = {
      nProgramsTotal: 105,
      nProgramsNow: 94,
      nOpportunitiesTotal: nOpportunitiesCreated,
      nOpportunities30Days: 65,
      demandsTimeSeries: [
        { year: '2023', month: '06', nDemands: 1 },
        { year: '2023', month: '07', nDemands: 5 },
        { year: '2023', month: '08', nDemands: 10 },
        { year: '2024', month: '09', nDemands: 26 },
        { year: '2024', month: '10', nDemands: 33 },
        { year: '2023', month: '11', nDemands: 105 },
        { year: '2023', month: '12', nDemands: 548 },
        { year: '2024', month: '01', nDemands: 712 },
        { year: '2024', month: '02', nDemands: 822 },
        { year: '2024', month: '03', nDemands: 907 },
        { year: '2024', month: '04', nDemands: 941 }
      ]
    }

    return Result.ok(fakeStatistics)
  }

  async getOpportunitiesCreated(): Promise<number | null> {
    const countResult = await this._opportunityRepository.count()

    if (countResult.isOk) {
      return countResult.value
    }

    return null
  }
}
