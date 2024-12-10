import { Maybe } from 'true-myth'
import { AxiosInstance } from 'axios'
import OpportunityHubAbstract from '../../../../../src/opportunityHub/infrastructure/api/opportunityHubAbstract'
import { Operators } from '@tee/data'

export class BpiFranceTest extends OpportunityHubAbstract {
  protected _axios: AxiosInstance
  protected readonly _baseUrl = ''
  protected readonly _operatorNames: Operators[] = ['Bpifrance']

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

  public transmitOpportunity = async (): Promise<Maybe<Error>> => {
    return Maybe.nothing()
  }
}
