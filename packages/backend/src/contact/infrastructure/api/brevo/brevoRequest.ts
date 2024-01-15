import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios'
import { Result } from 'true-myth'
import type { BrevoRequestData } from './types'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { handleException } from '../../../../common/domain/errors'

/**
 * Brevo API Documentation: 'https://developers.brevo.com/reference',
 */
export const requestBrevoAPI = async (data: BrevoRequestData): Promise<Result<AxiosResponse, Error>> => {
  const token = process.env['BREVO_API_TOKEN'] || ''

  try {
    const response: AxiosResponse = await axios.request({ ...data, headers: makeHeaders(token) })
    return Result.ok(response)
  } catch (err: unknown) {
    return Result.err(handleException(err))
  }
}

/**
 * Populate headers for a call to the "BREVO" API
 *
 * @arg token - API access token
 */
const makeHeaders = (token: string): RawAxiosRequestHeaders => {
  return {
    ...AxiosHeaders.makeJsonHeader(),
    'api-key': `${token}`
  }
}
