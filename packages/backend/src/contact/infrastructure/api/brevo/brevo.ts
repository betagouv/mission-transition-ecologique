import axios, { AxiosError, AxiosResponse, RawAxiosRequestHeaders } from 'axios'
import { Result } from 'true-myth'
import { ContactInfoRepository } from '../../../domain/spi'
import { ContactId, ContactInfoBodyAttributes, ContactUpdateAttributes } from '../../../domain/types'
import { BrevoBody, updateContactBody } from './types'
import { ensureError } from '../../../../common/domain/error/errors'
import ServiceNotFoundError from '../../../../common/domain/api/serviceNotFoundError'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'

const DEBUG_BREVO_LIST_ID = '4'

/**
 * addBrevoContact reads token and brevo list Ids from environment variables,
 * and adds a contact to brevo with the help of this information
 */
export const addBrevoContact: ContactInfoRepository['create'] = async (email: string, attributes: ContactInfoBodyAttributes) => {
  const token = process.env['BREVO_API_TOKEN'] || ''
  const rawListIds: string = process.env['BREVO_LIST_IDS'] || DEBUG_BREVO_LIST_ID
  const listIds = parseListIds(rawListIds)

  return requestCreateContact(token, listIds, email, attributes)
}

export const updateBrevoContact: ContactInfoRepository['update'] = async (contactId: ContactId, attributes: ContactUpdateAttributes) => {
  const token = process.env['BREVO_API_TOKEN'] || ''
  return requestUpdateContact(token, contactId, attributes)
}

const baseUrl = `https://api.brevo.com/v3`
const contactUrl = `${baseUrl}/contacts`
/**
 * requestCreateContact adds data about a contact in Brevo
 *
 * Documentation: 'https://developers.brevo.com/reference/createcontact',
 *
 * @arg token - API access token
 * @param listIds Ids of Brevo lists in which to store the contact
 * @param email email address to store
 * @param attributes additionnal attributes to store along
 *
 */
const requestCreateContact = async (
  token: string,
  listIds: number[],
  email: string,
  attributes: ContactInfoBodyAttributes
): Promise<Result<ContactId, Error>> => {
  try {
    const response: AxiosResponse<ContactId> = await axios.post(
      contactUrl,
      {
        email: email,
        listIds: listIds,
        attributes: attributes
      } as BrevoBody,
      {
        headers: makeHeaders(token)
      }
    )
    return Result.ok(response.data)
  } catch (err: unknown) {
    return handleException(err)
  }
}

const requestUpdateContact = async (
  token: string,
  contactId: ContactId,
  attributes: ContactUpdateAttributes
): Promise<Result<ContactId, Error>> => {
  const apiBrevoUrl = `${contactUrl}/${contactId.id}`

  try {
    await axios.put(
      apiBrevoUrl,
      {
        attributes: attributes
      } as updateContactBody,
      {
        headers: makeHeaders(token)
      }
    )
    return Result.ok(contactId)
  } catch (err: unknown) {
    return handleException(err)
  }
}

/** parseListIds parses a comma-separated list of Ids into an array of list
 * Ids.
 */
const parseListIds = (rawIds: string): number[] => {
  return rawIds.split(',').map((id) => parseInt(id))
}

function handleException(err: unknown): Result<ContactId, Error> {
  let error = ensureError(err)

  if (error instanceof AxiosError) {
    if (error.response && error.response.status == 404) {
      error = new ServiceNotFoundError()
    }
  }

  return Result.err(error)
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
