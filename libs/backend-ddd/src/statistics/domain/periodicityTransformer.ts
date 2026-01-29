import { StatsPeriodicity } from './types'

export class PeriodicityTransformer {
  constructor(
    private _since: number,
    private _periodicity: StatsPeriodicity
  ) {}

  toDate(): Date {
    const date = new Date()
    switch (this._periodicity) {
      case StatsPeriodicity.Day:
        date.setDate(date.getDate() - this._since)
        break
      case StatsPeriodicity.Week:
        date.setDate(date.getDate() - this._since * 7)
        break
      case StatsPeriodicity.Month:
        date.setMonth(date.getMonth() - this._since)
        break
      case StatsPeriodicity.Year:
        date.setFullYear(date.getFullYear() - this._since)
        break
    }

    return date
  }
}
