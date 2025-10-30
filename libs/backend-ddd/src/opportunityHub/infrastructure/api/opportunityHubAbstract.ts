import { Operators } from '@tee/data'
import { AxiosInstance } from 'axios'
import { OpportunityHubRepository } from '../../domain/spi'
import { Result } from 'true-myth'
import { Opportunity } from '@tee/common'
import { OpportunityAssociatedData } from '../../../opportunity/domain/opportunityAssociatedData'

export default abstract class OpportunityHubAbstract implements OpportunityHubRepository {
  protected abstract _axios: AxiosInstance
  protected abstract readonly _baseUrl: string
  protected abstract readonly _operatorNames: Operators[]

  support = (opportunityData: OpportunityAssociatedData) => {
    if (this.operatorNames instanceof Error) {
      return false
    }
    if (opportunityData.isProgram()) {
      return this.operatorNames.includes(opportunityData.data['opérateur de contact'] as Operators)
    }
    // only program are handled by this abstract class
    // other opportunity types are handled by PlaceDesEntreprise which overwrite this method
    return false
  }

  abstract hasDailyContactTransmissionLimit(): boolean
  abstract needReturnReceipt(): boolean

  public abstract transmitOpportunity: (
    opportunity: Opportunity,
    opportunityAssociatedData: OpportunityAssociatedData
  ) => Promise<Result<number, Error>>

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
