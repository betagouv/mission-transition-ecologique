import { BaserowFilter } from './types'

export class FilterBaserow {
  private _filters: BaserowFilter

  constructor(private _type: 'OR' | 'AND') {
    this._filters = { filter_type: this._type, filters: [], groups: [] }
  }

  get(): { filters: string } {
    return { filters: JSON.stringify(this._filters) }
  }

  withNotEmpty(fieldName: string): FilterBaserow {
    this._addFilter('not_empty', fieldName)
    return this
  }

  withIsActive(fieldName: string): FilterBaserow {
    this._addFilter('boolean', fieldName, 1)
    return this
  }

  private _addFilter(type: string, field: string, value: string | number = ''): void {
    this._filters.filters.push({ type, field, value })
  }
}
