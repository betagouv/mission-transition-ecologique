import { Result } from 'true-myth'

import { Statistics } from './types'
import { OpportunityRepository } from './spi'

export default class StatisticsFeatures {
  private readonly _opportunityRepository: OpportunityRepository

  constructor(opportunityRepository: OpportunityRepository) {
    this._opportunityRepository = opportunityRepository
  }

  async computeStatistics(): Promise<Result<Statistics, Error>> {
    await new Promise((res) => setTimeout(res, 100))

    const nOpportunitiesCreated = await this.getOpportunitiesCreated()

    const fakeStatistics: Statistics = {
      nProgramsActivated: null,
      nOpportunitiesCreated: nOpportunitiesCreated,
      nProgramsProposed: 532,
      demandsTimeSeries: [
        { year: '2023', month: '10', nDemands: 150 },
        { year: '2023', month: '11', nDemands: 123 },
        { year: '2023', month: '12', nDemands: 65 },
        { year: '2024', month: '01', nDemands: 110 },
        { year: '2024', month: '02', nDemands: 100 }
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
