export enum StatsPeriodicity {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year'
}

export interface StatQueryParams {
  periodicity?: StatsPeriodicity
  since?: Date
  to?: Date
}

export interface Stat {
  value: number
  date: string
}

export interface StatOutput {
  description?: string
  stats: Stat[]
}
