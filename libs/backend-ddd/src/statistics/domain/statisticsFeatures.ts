import { Stat, StatOutput, StatQueryParams } from '@tee/common'

export default class StatisticsFeatures {
  async fetchNorthStarStats(params: StatQueryParams): Promise<StatOutput> {
    const METABASE_URL = 'http://tee-metabase.osc-fr1.scalingo.io/public/question/6969b2ab-ec49-44a0-9db8-3e2f9afbcf29.json'

    const periodicity = params.periodicity || 'month'

    const today = new Date()
    const since = params.since ? new Date(params.since) : new Date(today.getFullYear(), 0, 1)
    const to = params.to ? new Date(params.to) : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)

    const response = await fetch(METABASE_URL)
    if (!response.ok) {
      throw new Error('Stats API: Failed to fetch Metabase data')
    }

    const rawData: { week_start_date: string; total_2_3: number }[] = await response.json()
    const filtered = rawData
      .map((row) => ({
        date: this.toLocalDateOnly(new Date(row.week_start_date)), // week_start_date is a metabase variable that is poorly named and that is simply the statistic date
        value: row.total_2_3
      }))
      .filter((row) => row.date >= since && row.date <= to)

    const grouped: Record<string, { date: Date; value: number }> = {}

    filtered.forEach(({ date, value }) => {
      const d = new Date(date)
      if (d < since || d > to) return

      let keyStatDate = today

      switch (periodicity) {
        case 'day':
          keyStatDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
          break
        case 'week': {
          const weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7))
          keyStatDate = weekStart
          break
        }
        case 'month':
          keyStatDate = new Date(d.getFullYear(), d.getMonth(), 1)
          break
        case 'year':
          keyStatDate = new Date(d.getFullYear(), 0, 1)
          break
      }

      keyStatDate.setHours(keyStatDate.getHours() + 15) // To compensate for UTC hours and locales that can cause issues
      const key = keyStatDate.toISOString().slice(0, 10)
      if (!grouped[key]) {
        grouped[key] = { date: keyStatDate, value: 0 }
      }
      grouped[key].value += value
    })

    const stats: Stat[] = Object.values(grouped)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((stat) => ({
        ...stat,
        date: stat.date.toISOString().split('T')[0]
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
