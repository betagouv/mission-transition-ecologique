import { addBrevoContact, updateBrevoContact } from '../infrastructure/api/brevo/brevo'
import { ContactId, ContactInfoBodyAttributes, ContactUpdateAttributes } from '../domain/types'
import Contact from '../domain/contact'

export default class ContactService {
  private _contact: Contact

  constructor() {
    this._contact = new Contact({
      create: addBrevoContact,
      update: updateBrevoContact
    })
  }

  public async create(email: string, attributes: ContactInfoBodyAttributes) {
    return this._contact.create(email, attributes)
  }

  public async update(contactId: ContactId, attributes: ContactUpdateAttributes) {
    return this._contact.update(contactId, attributes)
  }
}
