import { Result } from 'true-myth'
import { AxiosInstance } from 'axios'
import { Operators, Program } from '../../program/domain/types'
import { ContactInfo } from '../../contact/domain/types'
import { ContactId } from './types'

export interface OperatorRepository {
  get axios(): AxiosInstance
  get baseUrl(): string
  get operatorName(): Operators
  create: (contactInfo: ContactInfo, program: Program) => Promise<Result<ContactId, Error>>
  support: (program: Program) => boolean
}
