import { Result } from 'true-myth'
import { Operators, Program } from '../../program/domain/types'
import { ContactInfo } from '../../contact/domain/types'
import { ContactId } from './types'

export interface OperatorRepository {
  get operatorName(): Operators
  createOpportunity: (contactInfo: ContactInfo, program: Program) => Promise<Result<ContactId, Error>>
  support: (program: Program) => boolean
}
