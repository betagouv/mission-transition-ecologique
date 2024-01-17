import { Program } from '../../program/domain/types'
import { OperatorRepository } from './spi'
import { ContactInfo } from '../../contact/domain/types'
import { Result } from 'true-myth'
import { ContactId } from './types'

export default class Operator {
  private readonly _operatorRepositories: OperatorRepository[]
  constructor(operatorRepositories: OperatorRepository[]) {
    this._operatorRepositories = operatorRepositories
  }

  public async createOpportunity(contactInfo: ContactInfo, program: Program): Promise<Result<ContactId, Error> | false> {
    for (const operatorRepository of this._operatorRepositories) {
      if (operatorRepository.support(program)) {
        return await operatorRepository.createOpportunity(contactInfo, program)
      }
    }

    return false
  }
}
