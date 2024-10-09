import { EnrichedOperator } from '../../operators/types/shared'
import { AbstractBaserow } from './abstractBaserow'
import { Operator } from './types'

export class OperatorBaserow extends AbstractBaserow {
  async getAll(): Promise<EnrichedOperator[]> {
    const baserowOperators = await this._getTableData<Operator>(this._operatorTableId)

    return baserowOperators.map((baserowOperator) => this._convertToDomain(baserowOperator))
  }

  private _convertToDomain(baserowOperator: Operator): EnrichedOperator {
    return {
      operator: baserowOperator.nom,
      filterCategories: baserowOperator.filtre.map((link) => link.value)
    }
  }
}
