export type StatsPeriodicity = 'day' | 'week' | 'month' | 'year'

export interface StatQueryParams {
  periodicity?: StatsPeriodicity
  since?: string
  to?: string
}

export interface Stat {
  value: number
  date: string
}

export interface StatOutput {
  description?: string
  stats: Stat[]
}
