import { ContactInfoRepository } from './spi'
import { ContactId, ContactInfoBodyAttributes, ContactUpdateAttributes } from './types'

export default class Contact {
  private readonly _contactRepository: ContactInfoRepository

  constructor(contactRepository: ContactInfoRepository) {
    this._contactRepository = contactRepository
  }

  public async create(email: string, attributes: ContactInfoBodyAttributes) {
    return await this._contactRepository.create(email, attributes)
  }

  public async update(contactId: ContactId, attributes: ContactUpdateAttributes) {
    return await this._contactRepository.update(contactId, attributes)
  }
}
