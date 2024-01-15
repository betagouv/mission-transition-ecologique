import Operator from '../domain/operator'
import { ContactInfo } from '../../contact/domain/types'
import { Program } from '../../program/domain/types'
import { OperatorRepository } from '../domain/spi'
import { BpiFrance } from '../infrastructure/api/bpi/bpiFrance'
import { Result } from 'true-myth'
import { ContactId } from '../domain/types'

export default class OperatorService {
  private _operator: Operator

  constructor() {
    this._operator = new Operator(this.getOperatorRepositories())
  }

  create(contactInfo: ContactInfo, program: Program): Promise<Result<ContactId, Error> | false> {
    return this._operator.create(contactInfo, program)
  }

  private getOperatorRepositories(): OperatorRepository[] {
    return [new BpiFrance()]
  }
}
