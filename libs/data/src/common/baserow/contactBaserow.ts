import ConfigBaserow from '../../configBaserow'
import { Contact } from '../types'
import { AbstractBaserow } from './abstractBaserow'
import { BaserowContact } from './types'

export class ContactBaserow extends AbstractBaserow {
  async getAll(): Promise<Contact[]> {
    const baserowContacts = await this._getTableData<BaserowContact>(ConfigBaserow.CONTACT_ID)
    return baserowContacts.map((contact) => this._convertToDomain(contact))
  }

  private _convertToDomain(baserowContact: BaserowContact): Contact {
    return {
      id: baserowContact.id,
      name: baserowContact['Prénom NOM'],
      mail: baserowContact.Courriel
    }
  }
}
