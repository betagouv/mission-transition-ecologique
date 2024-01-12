import { ServiceNotFoundError, ContactId } from '../../../domain/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { ensureError } from '../../../../common/errors'
import { Result } from 'true-myth'
import { ContactInfoRepository } from '../../../domain/spi'

const DEBUG_BREVO_LIST_ID = '4'

/**
 * addBrevoContact reads token and brevo list Ids from environment variables,
 * and adds a contact to brevo with the help of this information
 */
export const addBrevoContact: ContactInfoRepository['add'] = async (email: string, attributes: object) => {
  const token = process.env['BREVO_API_TOKEN'] || ''

  const defaultListId = DEBUG_BREVO_LIST_ID
  const rawlistIds: string = process.env['BREVO_LIST_IDS'] || defaultListId
  const listIds = parseListIds(rawlistIds)

  return requestBrevoAPI(token, listIds, email, attributes)
}

/**
 * requestBrevoAPI adds data about a contact in Brevo
 *
 * Documentation: 'https://developers.brevo.com/reference/createcontact',
 *
 * @arg token - API access token
 * @listIds - Ids of Brevo lists in which to store the contact
 * @email - email address to store
 * @attributes - additionnal attributes to store along
 *
 */
const requestBrevoAPI = async (token: string, listIds: number[], email: string, attributes: object): Promise<Result<ContactId, Error>> => {
  const api_brevo_url = `https://api.brevo.com/v3/contacts`

  try {
    const response: AxiosResponse<ContactId> = await axios.post(
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
    return Result.ok(response.data)
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

/** parseListIds parses a comma-separated list of Ids into an array of list
 * Ids.
 */
const parseListIds = (rawIds: string): number[] => {
  return rawIds.split(',').map((id) => parseInt(id))
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
