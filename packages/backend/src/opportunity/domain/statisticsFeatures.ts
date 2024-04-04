import { Result } from 'true-myth'

import { Statistics } from './types'

export default class StatisticsFeatures {
  async computeStatistics(): Promise<Result<Statistics, Error>> {
    await new Promise((res) => setTimeout(res, 100))

    const fakeStatistics: Statistics = {
      nProgramsActivated: 'unknown',
      nOpportunitiesCreated: 532,
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
}
