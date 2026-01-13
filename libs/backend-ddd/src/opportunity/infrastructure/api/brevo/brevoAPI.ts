import axios, { AxiosInstance, AxiosResponse, RawAxiosRequestHeaders } from 'axios'
import { Result } from 'true-myth'
import Config from '../../../../config'
import {
  HttpMethod,
  BrevoPostContactPayload,
  BrevoPostDealPayload,
  BrevoPatchDealPayload,
  BrevoLinkDealPayload,
  BrevoRequestData
} from './types'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { handleException } from '../../../../common/domain/error/errors'

export default class BrevoAPI {
  private readonly _axios: AxiosInstance
  private readonly _baseURL = 'https://api.brevo.com/v3'

  constructor() {
    const token = Config.BREVO_API_TOKEN
    this._axios = axios.create({
      baseURL: this._baseURL,
      headers: this._makeHeaders(token)
    })
  }

  public PostContact(payload: BrevoPostContactPayload): Promise<Result<AxiosResponse, Error>> {
    return this._request({
      method: HttpMethod.POST,
      url: '/contacts',
      data: payload
    })
  }

  public GetContact(email: string): Promise<Result<AxiosResponse, Error>> {
    return this._request({
      method: HttpMethod.GET,
      url: `/contacts/${email}`
    })
  }

  public PostDeal(payload: BrevoPostDealPayload): Promise<Result<AxiosResponse, Error>> {
    return this._request({
      method: HttpMethod.POST,
      url: '/crm/deals',
      data: payload
    })
  }

  public LinkDeal(dealId: string, payload: BrevoLinkDealPayload): Promise<Result<AxiosResponse, Error>> {
    return this._request({
      method: HttpMethod.PATCH,
      url: `/crm/deals/link-unlink/${dealId}`,
      data: payload
    })
  }

  public PatchDeal(dealId: string, payload: BrevoPatchDealPayload): Promise<Result<AxiosResponse, Error>> {
    return this._request({
      method: HttpMethod.PATCH,
      url: `/crm/deals/${dealId}`,
      data: payload
    })
  }

  // https://developers.brevo.com/reference/get_crm-pipeline-details-all
  public GetDeals(startDate: Date = new Date('2022-01-01'), endDate: Date = new Date('2040-01-01')): Promise<Result<AxiosResponse, Error>> {
    const formattedStartDate = startDate.getTime() / 1000
    const formattedEndDate = endDate.getTime() / 1000

    return this._request({
      method: HttpMethod.GET,
      url: `/crm/deals?filters[attributes.created_at]=${formattedStartDate},${formattedEndDate}&limit=1000000`
    })
  }

  private async _request(data: BrevoRequestData): Promise<Result<AxiosResponse, Error>> {
    try {
      const response: AxiosResponse = await this._axios.request(data)
      return Result.ok(response)
    } catch (err: unknown) {
      return Result.err(handleException(err))
    }
  }

  private _makeHeaders(token: string): RawAxiosRequestHeaders {
    return {
      ...AxiosHeaders.makeJsonHeader(),
      'api-key': `${token}`
    }
  }
}
