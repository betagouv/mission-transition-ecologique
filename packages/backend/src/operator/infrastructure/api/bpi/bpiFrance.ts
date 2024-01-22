import { Result } from 'true-myth'
import axios, { AxiosInstance } from 'axios'
import type { TokenResponse } from './types'
import { ContactResponse } from './types'
import OperatorAbstract from '../operatorAbstract'
import { Operators, Program } from '../../../../program/domain/types'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { handleException } from '../../../../common/domain/error/errors'
import { Opportunity } from '../../../../opportunity/domain/types'
import { ContactId } from '../../../domain/types'
import opportunityPayloadDTO from './opportunityPayloadDTO'
import Config from '../../../../config'

export class BpiFrance extends OperatorAbstract {
  protected readonly _operatorName: Operators = 'Bpifrance'
  private readonly client_id = Config.BPI_FRANCE_CLIENT_ID
  private readonly client_secret = Config.BPI_FRANCE_CLIENT_SECRET

  protected readonly _baseUrl = 'https://bpifrance.my.salesforce.com/services'
  private readonly _tokenUrl = '/oauth2/token'
  private readonly _contactUrl = '/data/v55.0/sobjects/Case'

  protected _axios: AxiosInstance

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
      return Result.err(handleException(exception))
    }
  }

  public createOpportunity = async (opportunity: Opportunity, program: Program): Promise<Result<ContactId, Error>> => {
    try {
      const tokenResult = await this._getToken()
      if (tokenResult.isErr) {
        return Result.err(tokenResult.error)
      }

      const contactPayloadDTO = new opportunityPayloadDTO(opportunity, program).getPayload()
      const response = await this.axios.post(this._contactUrl, contactPayloadDTO, {
        headers: AxiosHeaders.makeBearerHeader(tokenResult.value.access_token)
      })

      return Result.ok(response.data as ContactResponse)
    } catch (exception: unknown) {
      return Result.err(handleException(exception))
    }
  }
}
