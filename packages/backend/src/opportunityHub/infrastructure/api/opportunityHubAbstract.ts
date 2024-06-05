import { Operators } from '@tee/data/src/generated/program'
import { AxiosInstance } from 'axios'
import { OpportunityHubRepository } from '../../domain/spi'
import { Program } from '../../../program/domain/types/types'
import { Opportunity, OpportunityWithContactId } from '../../../opportunity/domain/types'
import { Maybe } from 'true-myth'

export default abstract class OpportunityHubAbstract implements OpportunityHubRepository {
  protected abstract _axios: AxiosInstance
  protected abstract readonly _baseUrl: string
  protected abstract readonly _operatorNames: Operators[]

  support = (program: Program) => {
    if (this.operatorNames instanceof Error) {
      return false
    }
    return this.operatorNames.includes(program['opérateur de contact'] as Operators)
  }
  shouldTransmit = async (_: OpportunityWithContactId, program: Program) => {
    return Promise.resolve(this.support(program))
  }

  public abstract transmitOpportunity: (opportunity: Opportunity, Program: Program) => Promise<Maybe<Error>>

  get operatorNames(): Operators[] | Error {
    return this._operatorNames
  }

  protected get baseUrl(): string {
    return this._baseUrl
  }

  protected get axios(): AxiosInstance {
    return this._axios
  }
}
