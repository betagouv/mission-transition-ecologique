import { Stat, StatOutput, StatQueryParams, StatsPeriodicity } from './types'

export default class StatisticsFeatures {
  async fetchNorthStarStats(params: StatQueryParams): Promise<StatOutput> {
    const METABASE_URL = 'http://tee-metabase.osc-fr1.scalingo.io/public/question/6969b2ab-ec49-44a0-9db8-3e2f9afbcf29.json'

    const response = await fetch(METABASE_URL)
    if (!response.ok) {
      throw new Error('Stats API: Failed to fetch Metabase data')
    }

    const data: { week_start_date: string; total_2_3: number }[] = await response.json()
    if (data.length === 0) {
      return {
        description: `Entreprises bénéficiaires`,
        stats: []
      }
    }

    const periodicity = params.periodicity || StatsPeriodicity.Month
    const today = new Date()
    const since = params.since ?? new Date(today.getFullYear(), 0, 1)
    const to = params.to ?? new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)

    const filteredData = data
      .map((datum) => ({
        date: new Date(datum.week_start_date), // week_start_date is a metabase variable that is poorly named and that is simply the statistic date
        value: datum.total_2_3
      }))
      .filter((datum) => {
        return datum.date >= since && datum.date <= to
      })

    const statsByPeriodicity: Record<string, Stat> = {}

    filteredData.forEach(({ date, value }) => {
      let keyStatDate = today

      switch (periodicity) {
        case StatsPeriodicity.Day:
          // Set to the start of the day
          keyStatDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0))
          break
        case StatsPeriodicity.Week: {
          // Set to the start of the week (Monday)
          keyStatDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7), 0, 0, 0, 0))
          break
        }
        case StatsPeriodicity.Month:
          // Set to the start of the month
          keyStatDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0))
          break
        case StatsPeriodicity.Year:
          // Set to the start of the year
          keyStatDate = new Date(Date.UTC(date.getFullYear(), 0, 1, 0, 0, 0, 0))
          break
      }

      const key = keyStatDate.toISOString()
      if (!statsByPeriodicity[key]) {
        statsByPeriodicity[key] = { date: keyStatDate.toISOString(), value: 0 }
      }
      statsByPeriodicity[key].value += value
    })

    const stats: Stat[] = Object.values(statsByPeriodicity)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((stat) => ({
        ...stat,
        date: stat.date.split('T')[0]
      }))

    return {
      description: `Entreprises bénéficiaires`,
      stats
    }
  }

  toLocalDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
}
