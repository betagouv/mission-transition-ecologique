import { AxiosRequestConfig } from 'axios'
import { ContactDetails, Taille } from '../../../domain/types'

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

export type BrevoRequestData = BrevoPostContactData | BrevoGetContactData | BrevoPostDeal | BrevoLinkDealData | BrevoPatchDealData

export interface BrevoPostContactData extends AxiosRequestConfig {
  method: HttpMethod.POST
  url: 'https://api.brevo.com/v3/contacts'
  data: {
    email: string
    updateEnabled: true
    listIds: number[]
    attributes: ContactAttributes
  }
}

export interface BrevoGetContactData extends AxiosRequestConfig {
  method: HttpMethod.GET
  url: `https://api.brevo.com/v3/contacts/${string}`
}

export interface BrevoPostDeal extends AxiosRequestConfig {
  method: HttpMethod.POST
  url: 'https://api.brevo.com/v3/crm/deals'
  data: {
    name: string
    attributes: DealAttributes
  }
}

export interface BrevoLinkDealData extends AxiosRequestConfig {
  method: HttpMethod.PATCH
  url: `https://api.brevo.com/v3/crm/deals/link-unlink/${string}`
  data: {
    linkContactIds: number[]
  }
}

export interface BrevoPatchDealData extends AxiosRequestConfig {
  method: HttpMethod.PATCH
  url: `https://api.brevo.com/v3/crm/deals/${string}`
  data: {
    attributes: Partial<DealAttributes>
  }
}

export interface ContactAttributes {
  NOM: string
  PRENOM: string
  TEL: string
  SIRET: string
  OPT_IN: true
  DENOMINATION?: string
  SECTEUR_D_ACTIVITE?: string
  TAILLE?: Taille
}

export enum BrevoQuestionnaireRoute {
  DIRECTORY = 'annuaire',
  SPECIFIC_GOAL = 'jai_un_objectif_prcis',
  NO_SPECIFIC_GOAL = 'je_ne_sais_pas_par_o_commencer'
}

export interface DealAttributes {
  message: string
  parcours: BrevoQuestionnaireRoute
  objectifs_renseigns?: string
}

export interface UpdateContactBody {
  attributes: ContactDetails
}
