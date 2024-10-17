import { RawOperator } from '../../operators/types/domain'
import { AbstractBaserow } from './abstractBaserow'
import { Operator } from './types'

export class OperatorBaserow extends AbstractBaserow {
  async getAll(): Promise<RawOperator[]> {
    const baserowOperators = await this._getTableData<Operator>(this._operatorTableId)
    return baserowOperators
      .filter((baserowOperator) => baserowOperator.Nom != '')
      .map((baserowOperator) => this._convertToDomain(baserowOperator))
  }

  private _convertToDomain(baserowOperator: Operator): RawOperator {
    return {
      operator: baserowOperator.Nom,
      filterCategories: baserowOperator.Filtre.map((link) => link.value)
    }
  }
}
