import { Operator } from '../../operators/types/domain'
import { AbstractBaserow } from './abstractBaserow'
import { BaserowOperator } from './types'

export class OperatorBaserow extends AbstractBaserow {
  async getAll(): Promise<Operator[]> {
    const baserowOperators = await this._getTableData<BaserowOperator>(this._operatorTableId)
    return baserowOperators
      .filter((baserowOperator) => baserowOperator.Nom != '')
      .map((baserowOperator) => this._convertToDomain(baserowOperator))
  }

  private _convertToDomain(baserowOperator: BaserowOperator): Operator {
    return {
      id: baserowOperator.id,
      tag: baserowOperator.Tag,
      name: baserowOperator.Nom,
      siren: baserowOperator.siren,
      filterCategories: baserowOperator.Filtre.map((link) => link.value),
      normalizedName: baserowOperator['Nom Normalisé']
    }
  }
}
