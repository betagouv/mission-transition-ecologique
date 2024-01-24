import axios, { AxiosInstance, AxiosResponse, RawAxiosRequestHeaders } from 'axios'
import { Result } from 'true-myth'
import type { BrevoRequestData } from './types'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { handleException } from '../../../../common/domain/error/errors'

export default class BrevoAPI {
  private _axios: AxiosInstance
  private readonly _baseURL = 'https://api.brevo.com/v3'

  constructor() {
    const token = process.env['BREVO_API_TOKEN'] || ''
    this._axios = axios.create({
      baseURL: this.baseURL,
      headers: this._makeHeaders(token)
    })
  }

  public async request(data: BrevoRequestData): Promise<Result<AxiosResponse, Error>> {
    try {
      const response: AxiosResponse = await this.axios.request(data)
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

  private get baseURL(): string {
    return this._baseURL
  }

  private get axios(): AxiosInstance {
    return this._axios
  }
}
