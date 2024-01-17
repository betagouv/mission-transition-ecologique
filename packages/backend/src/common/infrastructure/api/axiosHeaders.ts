import { RawAxiosRequestHeaders } from 'axios'

export default class AxiosHeaders {
  static makeBearerHeader(token: string): RawAxiosRequestHeaders {
    return {
      authorization: `Bearer ${token}`
    }
  }

  static makeJsonHeader(): RawAxiosRequestHeaders {
    return {
      'content-type': 'application/json',
      accept: 'application/json'
    }
  }
}
