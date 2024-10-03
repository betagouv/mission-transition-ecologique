import { bpiOpportunityPayload } from './types'
import { ProgramType } from '@tee/data'
import { Opportunity, StructureSize } from '@tee/common'

export default class OpportunityPayloadDTO {
  private readonly Subject = 'Demande d’échange' as const
  private readonly Origin = 'Site Plateforme Etat TEE' as const
  private readonly Type = 'question' as const
  private readonly point_de_contact__c = 'Site Plateforme Etat TEE' as const
  private readonly _companySiret: string | undefined
  private readonly _companyName: string | undefined | null
  private readonly _companySize: StructureSize | undefined
  private readonly _phoneNumber: string
  private readonly _lastName: string
  private readonly _firstName: string
  private readonly _email: string
  private readonly _program: ProgramType
  private readonly _message: string

  constructor(opportunity: Opportunity, program: ProgramType) {
    this._email = opportunity.email
    this._firstName = opportunity.firstName
    this._lastName = opportunity.lastName
    this._phoneNumber = opportunity.phoneNumber
    this._companySiret = opportunity.companySiret
    this._companyName = opportunity.companyName
    this._companySize = opportunity.companySize
    this._program = program
    this._message = opportunity.message
  }

  public getPayload(): bpiOpportunityPayload {
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
      Description_Complementaire__c: ''
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
    return this._message
  }

  get program(): ProgramType {
    return this._program
  }

  private get programName(): string {
    return this.program['titre']
  }
}
