import { ContactDetails, ContactId } from '../../../domain/types'
import axios from 'axios'
import { Result } from 'true-myth'
import { ContactInfoRepository } from '../../../domain/spi'
import { ContactAttributes, HttpMethod } from './types'
import { requestBrevoAPI } from './brevoRequest'

const DEBUG_BREVO_LIST_ID = '4'

/**
 * addBrevoContact reads token and brevo list Ids from environment variables,
 * and adds a contact to brevo with the help of this information
 */
export const addBrevoContact: ContactInfoRepository['addContact'] = async (contact: ContactDetails, optIn: true) => {
  const defaultListId = DEBUG_BREVO_LIST_ID
  const rawlistIds: string = process.env['BREVO_LIST_IDS'] || defaultListId
  const listIds = parseListIds(rawlistIds)

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
}

const retrieveExistingContactId = async (email: string): Promise<Result<ContactId, Error>> => {
  const responseResult = await requestBrevoAPI({ method: HttpMethod.GET, url: `https://api.brevo.com/v3/contacts/${email}` })
  const contactId = responseResult.map((r) => r.data as ContactId)
  return contactId
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
