import { AxiosRequestConfig } from 'axios'
import { CompanySize } from '../../../domain/types'

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

// Payloads

export interface BrevoPostContactPayload extends AxiosRequestConfig {
  email: string
  updateEnabled: true
  listIds: number[]
  attributes: ContactAttributes
}

export interface BrevoPostDealPayload extends AxiosRequestConfig {
  name: string
  attributes: DealAttributes
}

export interface BrevoLinkDealPayload extends AxiosRequestConfig {
  linkContactIds: number[]
}

export interface BrevoPatchDealPayload extends AxiosRequestConfig {
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
  TAILLE?: CompanySize
}

export enum QuestionnaireRoute {
  Unknown = 'unknown',
  Precise = 'precise'
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

export interface DealUpdateAttributes {
  envoy__bpifrance: boolean
}
