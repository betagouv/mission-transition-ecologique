import { Result } from 'true-myth'
import { Operators } from '@tee/data/src/generated/program'
import { AxiosInstance } from 'axios'
import { OperatorRepository } from '../../domain/spi'
import { Program } from '../../../program/domain/types'
import { ContactInfo } from '../../../contact/domain/types'
import { ContactId } from '../../domain/types'

export default abstract class OperatorAbstract implements OperatorRepository {
  protected abstract _axios: AxiosInstance
  protected abstract readonly _baseUrl: string
  protected abstract readonly _operatorName: Operators

  support = (program: Program) => (program['opérateur de contact'] as Operators) === this.operatorName

  public abstract createOpportunity: (contactInfo: ContactInfo, Program: Program) => Promise<Result<ContactId, Error>>

  get operatorName(): Operators {
    return this._operatorName
  }

  protected get baseUrl(): string {
    return this._baseUrl
  }

  protected get axios(): AxiosInstance {
    return this._axios
  }
}
