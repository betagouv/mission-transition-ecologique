import { Operators } from '@tee/data'
import { Result } from 'true-myth'
import { AxiosInstance } from 'axios'
import OpportunityHubAbstract from '../../../../../src/opportunityHub/infrastructure/api/opportunityHubAbstract'

export class PlaceDesEntreprisesMock extends OpportunityHubAbstract {
  protected readonly _baseUrl = ''
  protected _axios: AxiosInstance
  protected readonly _operatorNames = [] // warning, invalid but never used since we override all possible external uses of this value right below
  constructor() {
    super()
    this._axios = {
      request: async () => {
        return {
          status: 200,
          data: {}
        }
      }
    } as unknown as AxiosInstance
  }

  override get operatorNames(): Operators[] | Error {
    return new Error('Operator List non valid for Place des entreprises')
  }

  override support = () => {
    return true
  }

  public needReturnReceipt() {
    return false
  }

  public hasDailyContactTransmissionLimit(): boolean {
    return true
  }

  public transmitOpportunity = async (): Promise<Result<number, Error>> => {
    return Result.ok(-1)
  }
}

export class PlaceDesEntreprisesMockWithReturnReceipt extends PlaceDesEntreprisesMock {
  public override needReturnReceipt() {
    return true
  }
}
