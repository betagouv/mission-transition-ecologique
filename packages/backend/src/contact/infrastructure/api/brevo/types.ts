import { AxiosRequestConfig } from 'axios'

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

export type BrevoRequestData = BrevoPostContactData | BrevoGetContactData | BrevoPostDeal | BrevoPatchDealData

export interface BrevoPostContactData extends AxiosRequestConfig {
  method: HttpMethod.POST
  url: 'https://api.brevo.com/v3/contacts'
  data: {
    email: string
    updateEnabled: true
    listIds: number[]
    attributes: object
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
    attributes: object
  }
}

export interface BrevoPatchDealData extends AxiosRequestConfig {
  method: HttpMethod.PATCH
  url: `https://api.brevo.com/v3/crm/deals/link-unlink/${string}`
  data: {
    linkContactIds: number[]
  }
}
