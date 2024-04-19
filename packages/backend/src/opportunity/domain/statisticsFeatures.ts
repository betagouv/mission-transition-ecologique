import { Result } from 'true-myth'

import StatsData from '@tee/common/src/stats/types'
import { OpportunityRepository } from './spi'
import ProgramService from '../../program/application/programService'

export default class StatisticsFeatures {
  private readonly _opportunityRepository: OpportunityRepository
  private readonly _cache: StatisticsCache

  constructor(opportunityRepository: OpportunityRepository) {
    this._opportunityRepository = opportunityRepository
    this._cache = StatisticsCache.getInstance()
  }

  async computeStatistics(): Promise<Result<StatsData, Error>> {
    if (!this._cache.lastStats || !this._cache.isCacheValid()) {
      const opportunityStats = await this.getOpportunityStatistics()
      const programStats = this.getProgramStatistics()

      const statistics: StatsData = {
        ...programStats,
        ...opportunityStats
      }
      this._cache.lastStats = {
        statistics: statistics,
        timestamp: Date.now()
      }
    }
    return Result.ok(this._cache.lastStats.statistics)
  }

  async getOpportunityStatistics(): Promise<{
    nOpportunitiesTotal: number | null
    nOpportunities30Days: number | null
    demandsTimeSeries: { year: string; month: string; nDemands: number }[]
  }> {
    const opportunitiesDate = await this.getOpportunitiesCreated()
    const thirtyDaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
    let datesWithinLast30Days = 0
    let timeSeries: { year: string; month: string; nDemands: number }[] = []
    if (opportunitiesDate) {
      datesWithinLast30Days = opportunitiesDate.filter((date) => date >= thirtyDaysAgo).length
      timeSeries = this.convertDatesToCumulativeTimeSeries(opportunitiesDate)
    }
    return {
      nOpportunitiesTotal: opportunitiesDate ? opportunitiesDate.length : null,
      nOpportunities30Days: opportunitiesDate ? datesWithinLast30Days : null,
      demandsTimeSeries: timeSeries
    }
  }

  getProgramStatistics(): { nProgramsTotal: number; nProgramsNow: number } {
    const service = new ProgramService()
    const allPrograms = service.getAll()
    const activeProgramsResult = service.getFilteredPrograms({})
    if (activeProgramsResult.isErr) {
      throw activeProgramsResult.error
    }
    return {
      nProgramsTotal: allPrograms.length,
      nProgramsNow: activeProgramsResult.value.length
    }
  }

  convertDatesToCumulativeTimeSeries(opportunitiesDate: Date[]): { year: string; month: string; nDemands: number }[] {
    const timeSerieArray: { year: string; month: string; nDemands: number }[] = []

    for (const date of opportunitiesDate) {
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')

      const existingEntryIndex = timeSerieArray.findIndex((entry) => entry.year === year && entry.month === month)
      if (existingEntryIndex !== -1) {
        const entry = timeSerieArray[existingEntryIndex] as { year: string; month: string; nDemands: number }
        entry.nDemands++
      } else {
        timeSerieArray.push({ year, month, nDemands: 1 })
      }
    }

    return this.convertToCumulativeTimeSeries(timeSerieArray)
  }

  convertToCumulativeTimeSeries(
    timeSerieArray: { year: string; month: string; nDemands: number }[]
  ): { year: string; month: string; nDemands: number }[] {
    // Sort the array by year and month
    const sortedArray = timeSerieArray.sort((a, b) => {
      const yearComparison = a.year.localeCompare(b.year)
      if (yearComparison !== 0) {
        return yearComparison
      } else {
        return a.month.localeCompare(b.month)
      }
    })

    // compute the cumulative sum
    let cumulativeTotal = 0
    return sortedArray.map((entry) => {
      cumulativeTotal += entry.nDemands

      return {
        year: entry.year,
        month: entry.month,
        nDemands: cumulativeTotal
      }
    })
  }

  async getOpportunitiesCreated(): Promise<Date[] | null> {
    const countResult = await this._opportunityRepository.readDates()

    if (countResult.isOk) {
      return countResult.value
    }

    return null
  }
}

class StatisticsCache {
  private static instance: StatisticsCache
  public lastStats?: { statistics: StatsData; timestamp: number }

  public static getInstance(): StatisticsCache {
    if (!StatisticsCache.instance) {
      StatisticsCache.instance = new StatisticsCache()
    }
    return StatisticsCache.instance
  }

  public isCacheValid(): boolean {
    if (!this.lastStats) {
      return false
    }
    const expirationTime = 24 * 60 * 60 * 1000 // 1 day in milliseconds
    const currentTime = Date.now()
    return currentTime - this.lastStats.timestamp < expirationTime
  }
}
