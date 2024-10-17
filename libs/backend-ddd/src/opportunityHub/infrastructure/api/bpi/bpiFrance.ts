import { Maybe, Result } from 'true-myth'
import axios, { AxiosInstance } from 'axios'
import type { TokenResponse } from './types'
import OpportunityHubAbstract from '../opportunityHubAbstract'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { ensureError, handleException } from '../../../../common/domain/error/errors'
import opportunityPayloadDTO from './opportunityPayloadDTO'
import Config from '../../../../config'
import { Operators } from '@tee/data'
import { Opportunity } from '@tee/common'
import Monitor from '../../../../common/domain/monitoring/monitor'
import { OpportunityAssociatedData } from '../../../../opportunity/domain/opportunityAssociatedData'

export class BpiFrance extends OpportunityHubAbstract {
  protected _axios: AxiosInstance
  protected readonly _baseUrl = 'https://bpifrance.my.salesforce.com/services'
  protected readonly _operatorNames: Operators[] = ['Bpifrance']
  private readonly client_id = Config.BPI_FRANCE_CLIENT_ID
  private readonly client_secret = Config.BPI_FRANCE_CLIENT_SECRET
  private readonly _tokenUrl = '/oauth2/token'
  private readonly _contactUrl = '/data/v55.0/sobjects/Case'

  constructor() {
    super()
    this._axios = axios.create({
      baseURL: this.baseUrl,
      timeout: 3000,
      headers: AxiosHeaders.makeJsonHeader()
    })
  }

  private _getToken = async (): Promise<Result<TokenResponse, Error>> => {
    try {
      const response = await this.axios.get(this._tokenUrl, {
        params: {
          grant_type: 'client_credentials',
          client_id: this.client_id,
          client_secret: this.client_secret
        }
      })
      return Result.ok(response.data)
    } catch (exception: unknown) {
      Monitor.exception(ensureError(exception))
      return Result.err(handleException(exception))
    }
  }

  public transmitOpportunity = async (opportunity: Opportunity, opportunityData: OpportunityAssociatedData): Promise<Maybe<Error>> => {
    if (!opportunityData.isProgram()) {
      return Maybe.of(Error('BPI should only be transfered opportunities that are of type Program.'))
    }
    const contactPayloadDTO = new opportunityPayloadDTO(opportunity, opportunityData.data).getPayload()
    try {
      const tokenResult = await this._getToken()
      if (tokenResult.isErr) {
        return Maybe.of(tokenResult.error)
      }

      const response = await this.axios.post(this._contactUrl, contactPayloadDTO, {
        headers: AxiosHeaders.makeBearerHeader(tokenResult.value.access_token)
      })
      if (response.status >= 200 && response.status < 300) {
        return Maybe.nothing()
      } else {
        Monitor.error('Error creating an opportunity at BPI during BPI API Call', { BpiResponse: response })
        return Maybe.of(new Error("Erreur à la création d'une opportunité chez BPI durant l'appel BPI. HTTP CODE:" + response.status))
      }
    } catch (exception: unknown) {
      Monitor.exception(ensureError(exception), { ...contactPayloadDTO })
      return Maybe.of(handleException(exception))
    }
  }
}
