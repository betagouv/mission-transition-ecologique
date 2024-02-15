import { AxiosRequestConfig, Method } from 'axios'
import { Operators } from '@tee/data/src/generated/program'

export { QuestionnaireRoute } from '../../../../../../common/src/questionnaire/types'

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

export interface BrevoRequestData extends AxiosRequestConfig {
  method: Method
  url: string
  data?: BrevoPostContactPayload | BrevoPostDealPayload | BrevoLinkDealPayload | BrevoPatchDealPayload
}

// Payloads

export interface BrevoPostContactPayload {
  email: string
  updateEnabled: true
  listIds: number[]
  attributes: ContactAttributes
}

export interface BrevoPostDealPayload {
  name: string
  attributes: DealAttributes
}

export interface BrevoLinkDealPayload {
  linkContactIds: number[]
}

export interface BrevoPatchDealPayload {
  attributes: DealUpdateAttributes
}

// Brevo custom attributes

export interface ContactAttributes {
  NOM: string
  PRENOM: string
  TEL: string
  SIRET: string
  OPT_IN: true
  DENOMINATION?: string
  SECTEUR_D_ACTIVITE?: string
  TAILLE?: BrevoCompanySize
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
  oprateur_de_contact?: Operators
  autres_donnes?: string
}

export interface DealUpdateAttributes {
  envoy: boolean
}

export enum BrevoCompanySize {
  LESS_THAN_20 = 1,
  FROM_20_TO_49,
  FROM_50_TO_250,
  MORE_THAN_250
}
