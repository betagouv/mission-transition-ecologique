import { ContactDetails, ContactId } from '../../../domain/types'
import axios from 'axios'
import { Result } from 'true-myth'
import { ContactRepository } from '../../../domain/spi'
import { ContactAttributes } from './types'
import BrevoAPI from './brevoAPI'

const DEBUG_BREVO_LIST_ID = '4'

export const addBrevoContact: ContactRepository['createOrUpdate'] = async (contact: ContactDetails, optIn: true) => {
  const defaultListId = DEBUG_BREVO_LIST_ID
  const rawlistIds: string = process.env['BREVO_LIST_IDS'] || defaultListId
  const listIds = parseListIds(rawlistIds)

  return requestCreateContact(listIds, contact, optIn)
}

const requestCreateContact = async (listIds: number[], contact: ContactDetails, optIn: true): Promise<Result<ContactId, Error>> => {
  const responseResult = await new BrevoAPI().PostContact({
    email: contact.email,
    updateEnabled: true,
    listIds: listIds,
    attributes: convertDomainToBrevoContact(contact, optIn)
  })

  if (responseResult.isErr) {
    return Result.err(responseResult.error)
  }

  const response = responseResult.value
  let contactId: Result<ContactId, Error>

  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  if (response.status == axios.HttpStatusCode.Created) {
    contactId = Result.ok(response.data as ContactId)
  } else {
    contactId = await retrieveExistingContactId(contact.email)
  }

  return contactId
}

const retrieveExistingContactId = async (email: string): Promise<Result<ContactId, Error>> => {
  const responseResult = await new BrevoAPI().GetContact(email)
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
    NOM: contact.lastName,
    PRENOM: contact.firstName,
    TEL: contact.phoneNumber,
    SIRET: contact.companySiret,
    OPT_IN: optIn,
    ...(contact.companyName && { DENOMINATION: contact.companyName }),
    ...(contact.companySector && { SECTEUR_D_ACTIVITE: contact.companySector }),
    ...(contact.companySize && { TAILLE: contact.companySize })
  }
}
