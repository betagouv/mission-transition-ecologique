import Operator from '../domain/operator'
import { Program } from '../../program/domain/types'
import { OperatorRepository } from '../domain/spi'
import { BpiFrance } from '../infrastructure/api/bpi/bpiFrance'
import { Result } from 'true-myth'
import { ContactId } from '../domain/types'
import { Opportunity } from '../../contact/domain/types'

export default class OperatorService {
  private _operator: Operator

  constructor() {
    this._operator = new Operator(this.getOperatorRepositories())
  }

  create(opportunity: Opportunity, program: Program): Promise<Result<ContactId, Error> | false> {
    return this._operator.create(opportunity, program)
  }

  private getOperatorRepositories(): OperatorRepository[] {
    return [new BpiFrance()]
  }
}
