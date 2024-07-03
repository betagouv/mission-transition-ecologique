import { DemandsAtTime, OpportunityStats, ProgramStats, StatsData } from '@tee/common'
import { ProgramService } from '../../program/application/programService'
import { Result } from 'true-myth'
import { OpportunityRepository } from '../../opportunity/domain/spi'
import StatisticsCache from './statisticsCache'
import * as Sentry from '@sentry/node'
export default class StatisticsFeatures {
  private readonly _opportunityRepository: OpportunityRepository
  private readonly _cache: StatisticsCache
  private readonly _programService: ProgramService

  constructor(opportunityRepository: OpportunityRepository, programService: ProgramService) {
    this._opportunityRepository = opportunityRepository
    this._cache = StatisticsCache.getInstance()
    this._programService = programService
  }

  async computeStatistics(): Promise<Result<StatsData, Error>> {
    if (!this._cache.statistics || !this._cache.isValid()) {
      const opportunityStats = await this.getOpportunityStatistics()
      const programStats = this.getProgramStatistics()

      const statistics: StatsData = {
        ...programStats,
        ...opportunityStats
      }
      this._cache.statistics = {
        statistics: statistics,
        timestamp: Date.now()
      }
    }
    return Result.ok(this._cache.statistics.statistics)
  }

  async getOpportunityStatistics(): Promise<OpportunityStats> {
    const opportunitiesDates = await this.getOpportunitiesCreated()
    let datesWithinLast30Days = 0
    let timeSeries: DemandsAtTime[] = []
    if (opportunitiesDates) {
      const thirtyDaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
      datesWithinLast30Days = opportunitiesDates.filter((date) => date >= thirtyDaysAgo).length
      timeSeries = this.convertDatesToCumulativeTimeSeries(opportunitiesDates)
    }
    return {
      countOpportunitiesTotal: opportunitiesDates ? opportunitiesDates.length : null,
      countOpportunities30Days: opportunitiesDates ? datesWithinLast30Days : null,
      demandsTimeSeries: timeSeries
    }
  }

  getProgramStatistics(): ProgramStats {
    const allPrograms = this._programService.getAll()
    const activeProgramsResult = this._programService.getFilteredPrograms({})
    if (activeProgramsResult.isErr) {
      Sentry.captureMessage('Error generating program statistics ' + activeProgramsResult.error, 'error')
      throw activeProgramsResult.error
    }
    return {
      countProgramsTotal: allPrograms.length,
      countProgramsNow: activeProgramsResult.value.length
    }
  }

  convertDatesToCumulativeTimeSeries(opportunitiesDate: Date[]): DemandsAtTime[] {
    const timeSeries: DemandsAtTime[] = []

    for (const date of opportunitiesDate) {
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      const existingEntryIndex = timeSeries.findIndex((entry) => entry.year === year && entry.month === month)
      if (existingEntryIndex !== -1) {
        const entry = timeSeries[existingEntryIndex] as DemandsAtTime
        entry.nDemands++
      } else {
        timeSeries.push({ year: year, month: month, nDemands: 1 })
      }
    }

    return this.convertToCumulativeTimeSeries(timeSeries)
  }

  convertToCumulativeTimeSeries(timeSeries: DemandsAtTime[]): DemandsAtTime[] {
    // Sort the array by year and month
    timeSeries.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year
      }
      return a.month - b.month
    })
    // compute the cumulative sum
    let cumulativeTotal = 0
    return timeSeries.map((entry) => {
      cumulativeTotal += entry.nDemands

      return {
        year: entry.year,
        month: entry.month,
        nDemands: cumulativeTotal
      }
    })
  }

  async getOpportunitiesCreated(): Promise<Date[] | null> {
    const opportunitiesDates = await this._opportunityRepository.readDates()

    if (opportunitiesDates.isOk) {
      return opportunitiesDates.value
    }
    Sentry.captureMessage('Error generating Opportunities dates ' + opportunitiesDates.error, 'error')
    return null
  }
}
