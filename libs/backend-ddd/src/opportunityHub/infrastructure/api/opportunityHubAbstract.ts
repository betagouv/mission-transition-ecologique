import { Operators, ProgramType, Project } from '@tee/data'
import { AxiosInstance } from 'axios'
import { OpportunityHubRepository } from '../../domain/spi'
import { OpportunityObjectDetails, OpportunityWithContactId } from '../../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { Opportunity } from '@tee/common'

export default abstract class OpportunityHubAbstract implements OpportunityHubRepository {
  protected abstract _axios: AxiosInstance
  protected abstract readonly _baseUrl: string
  protected abstract readonly _operatorNames: Operators[]

  support = (opportunityObject: OpportunityObjectDetails) => {
    if ()
    if (this.operatorNames instanceof Error) {
      return false
    }
    return this.operatorNames.includes(program['opérateur de contact'] as Operators)
  }
  shouldTransmit = async (_: OpportunityWithContactId, program: OpportunityObjectDetails) => {
    return Promise.resolve(this.support(program))
  }

  public abstract transmitOpportunity: (opportunity: Opportunity, programOrProject: OpportunityObjectDetails) => Promise<Maybe<Error>>

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
