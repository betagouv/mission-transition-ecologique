import { addBrevoContact, updateBrevoContact } from '../infrastructure/api/brevo/brevo'
import { ContactId, ContactInfo, ContactInfoBodyAttributes, ContactUpdateAttributes } from '../domain/types'
import Contact from '../domain/contact'
import ProgramService from '../../program/application/programService'
import OperatorService from '../../operator/application/operatorService'
import { Result } from 'true-myth'

export default class ContactService {
  private _contact: Contact

  constructor() {
    this._contact = new Contact({
      create: addBrevoContact,
      update: updateBrevoContact
    })
  }

  public async create(email: string, attributes: ContactInfoBodyAttributes) {
    const contactInfoResult = await this._contact.create(email, attributes)

    this._createOpportunityOnOperator(contactInfoResult, { email: email, attributes: attributes })

    return contactInfoResult
  }

  public async update(contactId: ContactId, attributes: ContactUpdateAttributes) {
    return this._contact.update(contactId, attributes)
  }

  private _createOpportunityOnOperator(contactInfoResult: Result<ContactId, Error>, contactInfo: ContactInfo) {
    if (contactInfoResult.isErr) {
      return
    }

    const program = new ProgramService().getById(contactInfo.attributes.PROGRAM_ID)

    if (program) {
      void new OperatorService().createOpportunity(contactInfo, program).then(async (operatorResult) => {
        if (false !== operatorResult) {
          const contactUpdateResult = await new ContactService().update(contactInfoResult.value, { BPI_FRANCE: operatorResult.isOk })
          if (contactUpdateResult.isErr) {
            // TODO: Send an email to the admin: Contact not updated
          }
        }
      })
    }
  }
}
