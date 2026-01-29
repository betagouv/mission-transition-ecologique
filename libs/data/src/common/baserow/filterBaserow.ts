import { BaserowFilter } from './types'

export class FilterBaserow {
  private _filters: BaserowFilter

  constructor(private _type: 'OR' | 'AND') {
    this._filters = { filter_type: this._type, filters: [], groups: [] }
  }

  get(): { filters: string } {
    return { filters: JSON.stringify(this._filters) }
  }

  withEmpty(fieldName: string): FilterBaserow {
    this._addFilter('empty', fieldName)
    return this
  }

  withNotEmpty(fieldName: string): FilterBaserow {
    this._addFilter('not_empty', fieldName)
    return this
  }

  withIsActive(fieldName: string): FilterBaserow {
    this._addFilter('boolean', fieldName, 1)
    return this
  }

  withFieldEqualToValue(fieldName: string, value: string | number): FilterBaserow {
    this._addFilter('equal', fieldName, value)
    return this
  }

  private _addFilter(type: string, field: string, value: string | number = ''): void {
    this._filters.filters.push({ type, field, value })
  }
}
