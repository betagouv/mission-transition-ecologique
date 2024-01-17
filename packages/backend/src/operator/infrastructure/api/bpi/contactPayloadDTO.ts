import { ContactInfo } from '../../../../contact/domain/types'
import { Program } from '../../../../program/domain/types'
import { ContactPayload } from './types'

export default class ContactPayloadDTO {
  private readonly Subject = 'Demande d’échange' as const
  private readonly Origin = 'Site Plateforme Etat TEE' as const
  private readonly Type = 'question' as const
  private readonly point_de_contact__c = 'Site Plateforme Etat TEE' as const
  private readonly _companySize: string | number | undefined
  private readonly _companySiret: string | undefined
  private readonly _companyName: string | undefined
  private readonly _phoneNumber: string
  private readonly _lastName: string
  private readonly _firstName: string
  private readonly _email: string
  private readonly _program: Program
  private readonly _responses: string
  private readonly _description: string

  constructor(contactInfo: ContactInfo, program: Program) {
    this._email = contactInfo.email
    this._firstName = contactInfo.attributes.PRENOM
    this._lastName = contactInfo.attributes.NOM
    this._phoneNumber = contactInfo.attributes.TEL
    this._companySiret = contactInfo.attributes.SIRET
    this._companySize = contactInfo.attributes.STRUCTURE_SIZE
    this._responses = contactInfo.attributes.ALL_RESPONSES
    this._program = program
    this._description = contactInfo.attributes.FORM_NEEDS
  }

  public getPayload(): ContactPayload {
    return {
      Origin: this.Origin,
      Type: this.Type,
      point_de_contact__c: this.point_de_contact__c,
      Subject: this.Subject,
      Produit_souhaite__c: this.programName,
      SuppliedEmail: this.email,
      SuppliedName: this.fullName,
      SuppliedFirstName__c: this.firstName,
      SuppliedLastName__c: this.lastName,
      SuppliedPhone: this.phoneNumber,
      SuppliedCompany: this.companyName,
      SIRET__c: this.companySiret,
      Taille_de_lentreprise__c: this.companySize,
      Description: this.description,
      Description_Complementaire__c: this.responses
    }
  }

  private get companySize(): string | number | undefined {
    return this._companySize
  }

  private get companySiret(): string | undefined {
    return this._companySiret
  }

  private get companyName(): string | undefined {
    return this._companyName ?? '-'
  }

  private get phoneNumber(): string {
    return this._phoneNumber
  }

  private get lastName(): string {
    return this._lastName
  }

  private get firstName(): string {
    return this._firstName
  }

  private get email(): string {
    return this._email
  }

  private get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  private get description(): string {
    return this._description
  }

  private get responses(): string {
    return this._responses
  }

  get program(): Program {
    return this._program
  }

  private get programName(): string {
    return this.program['titre']
  }
}
