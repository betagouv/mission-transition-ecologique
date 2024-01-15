import { ContactDetails, ContactId } from '../../../domain/types'
import axios from 'axios'
import { Result } from 'true-myth'
import { ContactRepository } from '../../../domain/spi'
import { ContactAttributes, HttpMethod } from './types'
import { requestBrevoAPI } from './brevoRequest'

const DEBUG_BREVO_LIST_ID = '4'

/**
 * addBrevoContact reads token and brevo list Ids from environment variables,
 * and adds a contact to brevo with the help of this information
 */
export const addBrevoContact: ContactRepository['create'] = async (contact: ContactDetails, optIn: true) => {
  const defaultListId = DEBUG_BREVO_LIST_ID
  const rawlistIds: string = process.env['BREVO_LIST_IDS'] || defaultListId
  const listIds = parseListIds(rawlistIds)

  return requestCreateContact(token, listIds, contact)
}

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
  contact: ContactDetails,
  optIn: true
): Promise<Result<ContactId, Error>> => {
  ///
  const responseResult = await requestBrevoAPI({
    method: HttpMethod.POST,
    url: 'https://api.brevo.com/v3/contacts',
    data: {
      email: contact.email,
      updateEnabled: true,
      listIds: listIds,
      attributes: convertDomainToBrevoContact(contact, optIn)
    }
  })

  if (responseResult.isErr) return Result.err(responseResult.error)

  const response = responseResult.value
  let contactId: Result<ContactId, Error>

  if (response.status == axios.HttpStatusCode.Created) {
    contactId = Result.ok(response.data as ContactId)
  } else {
    contactId = await retrieveExistingContactId(contact.email)
  }

  return contactId
  ///

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

const retrieveExistingContactId = async (email: string): Promise<Result<ContactId, Error>> => {
  const responseResult = await requestBrevoAPI({ method: HttpMethod.GET, url: `https://api.brevo.com/v3/contacts/${email}` })
  const contactId = responseResult.map((r) => r.data as ContactId)
  return contactId
}

export const updateBrevoContact: ContactRepository['update'] = async (contactId: ContactId, attributes: ContactUpdateAttributes) => {
  const token = process.env['BREVO_API_TOKEN'] || ''
  return requestUpdateContact(token, contactId, attributes)
}

const baseUrl = `https://api.brevo.com/v3`
const contactUrl = `${baseUrl}/contacts`

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
function convertDomainToBrevoContact(contact: ContactDetails, optIn: true): ContactAttributes {
  return {
    NOM: contact.name,
    PRENOM: contact.forname,
    TEL: contact.phone,
    SIRET: contact.siret,
    OPT_IN: optIn,
    ...(contact.companyName && { DENOMINATION: contact.companyName }),
    ...(contact.companySector && { SECTEUR_D_ACTIVITE: contact.companySector }),
    ...(contact.companySize && { TAILLE: contact.companySize })
  }
}
