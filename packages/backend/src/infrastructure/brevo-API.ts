import { ServiceNotFoundError, ContactID } from '../domain/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { BrevoDocument } from './types'
import { ensureError } from './helpers'
import { Result } from 'true-myth'

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

/**
 * requestBrevoAPI requests data about user
 *
 * documentation: 'https://developers.brevo.com/reference/createcontact',
 *
 * @arg token - API access token
 */
export const requestBrevoAPI = async (
  token: string,
  email: string,
  listIds: number[],
  attributes: object
): Promise<Result<ContactID, Error>> => {
  const api_brevo_url = `https://api.brevo.com/v3/contacts`

  try {
    const response: AxiosResponse<BrevoDocument> = await axios.post(
      api_brevo_url,
      {
        email: email,
        listIds: listIds,
        attributes: attributes
      },
      {
        headers: makeHeaders(token)
      }
    )
    return Result.ok(response.data as BrevoResponse)
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
