import { StatsData } from '@tee/common'

export default class StatisticsCache {
  private static instance: StatisticsCache
  public statistics?: { statistics: StatsData; timestamp: number }

  public static getInstance(): StatisticsCache {
    if (!StatisticsCache.instance) {
      StatisticsCache.instance = new StatisticsCache()
    }
    return StatisticsCache.instance
  }

  public isValid(): boolean {
    if (!this.statistics) {
      return false
    }
    const expirationTime = 24 * 60 * 60 * 1000 // 1 day in milliseconds
    const currentTime = Date.now()
    return currentTime - this.statistics.timestamp < expirationTime
  }
}
