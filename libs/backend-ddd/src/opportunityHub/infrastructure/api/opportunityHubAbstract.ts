import { Operators } from '@tee/data'
import { AxiosInstance } from 'axios'
import { OpportunityHubRepository } from '../../domain/spi'
import { OpportunityWithContactId } from '../../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { Opportunity } from '@tee/common'
import { OpportunityObject } from '../../../opportunity/domain/opportunityObject'

export default abstract class OpportunityHubAbstract implements OpportunityHubRepository {
  protected abstract _axios: AxiosInstance
  protected abstract readonly _baseUrl: string
  protected abstract readonly _operatorNames: Operators[]

  support = (opportunityData: OpportunityObject) => {
    if (this.operatorNames instanceof Error) {
      return false
    }
    if (opportunityData.isProgram()) {
      return this.operatorNames.includes(opportunityData.opportunityObject['opérateur de contact'] as Operators)
    }
    // only program are handled by this abstract class
    // other opportunity types are handled by PlaceDesEntreprise which overwrite this method
    return false
  }

  shouldTransmit = async (_: OpportunityWithContactId, opportunityAssociatedData: OpportunityObject) => {
    return Promise.resolve(this.support(opportunityAssociatedData))
  }

  public abstract transmitOpportunity: (opportunity: Opportunity, opportunityAssociatedData: OpportunityObject) => Promise<Maybe<Error>>

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
