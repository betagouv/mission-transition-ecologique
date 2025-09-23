export class FilterBaserow {
  private _filters: Record<any, any>

  constructor(private _type: 'OR' | 'AND') {
    this._filters = { filter_type: this._type, filters: [] }
  }

  get(): Record<any, any> {
    return this._filters
  }

  withNotEmpty(fieldName: string): FilterBaserow {
    this._filters = { ...this._filters, ...{ filters: { type: 'not_empty', field: fieldName, value: '' } } }

    return this
  }

  withIsActive(fieldName: string): FilterBaserow {
    this._filters = { ...this._filters, ...{ filters: { type: 'boolean', field: fieldName, value: 1 } } }

    return this
  }
}
