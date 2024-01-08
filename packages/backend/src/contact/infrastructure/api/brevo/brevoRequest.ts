import { ServiceNotFoundError } from '../../../domain/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Result } from 'true-myth'
import type { BrevoRequestData } from './types'
import { ensureError } from '../../../../common/errors'

/**
 * requestBrevoAPI adds data about a contact in Brevo
 *
 * Documentation: 'https://developers.brevo.com/reference/createcontact',
 *
 * @arg token - API access token
 * @listIds - Ids of Brevo lists in which to store the contact
 * @email - email address to store
 * @attributes - additdionnal attributes to store along
 *
 */
export const requestBrevoAPI = async (data: BrevoRequestData): Promise<Result<AxiosResponse, Error>> => {
  const token = process.env['BREVO_API_TOKEN'] || ''

  try {
    const response: AxiosResponse = await axios.request({ ...data, headers: makeHeaders(token) })
    return Result.ok(response)
  } catch (err: unknown) {
    let error = ensureError(err)

    if (error instanceof AxiosError) {
      if (error.response && error.response.status == 404) {
        error = new ServiceNotFoundError()
      }
    }

    return Result.err(error)
  }
}

/**
 * Populate headers for a call to the "BREVO" API
 *
 * @arg token - API access token
 */
const makeHeaders = (token: string) => {
  const jsonContentType = 'application/json'
  return {
    accept: jsonContentType,
    'content-type': jsonContentType,
    'api-key': `${token}`
  }
}
