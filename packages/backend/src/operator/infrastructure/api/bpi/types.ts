import { ContactId } from '../../../domain/types'

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface ContactPayload {
  Subject: 'Demande d’échange'
  Produit_souhaite__c: string
  SuppliedEmail: string
  SuppliedName: string
  SuppliedLastName__c: string
  SuppliedFirstName__c: string
  SuppliedPhone: string
  SuppliedCompany: string | undefined
  SIRET__c: string | undefined
  Taille_de_lentreprise__c: string | number | undefined
  Description: string
  Description_Complementaire__c: string
  Origin: 'Site Plateforme Etat TEE'
  point_de_contact__c: 'Site Plateforme Etat TEE'
  Type: 'question'
}

export interface ContactResponse extends ContactId {
  id: string
  success: boolean
  errors: string[]
}
