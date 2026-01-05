import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'
import ConfigAdeme from '../../config/configAdeme'
import { AdemeTypeReferentiel } from './types'

dotenv.config()

export class AdemeApi {
  private readonly _clientId = ConfigAdeme.CLIENT_ID
  private readonly _clientSecret = ConfigAdeme.CLIENT_SECRET
  private readonly _baseUrl = ConfigAdeme.BASE_URL

  private readonly _axiosConfig = {
    headers: {
      client_id: this._clientId,
      client_secret: this._clientSecret,
      'Content-Type': 'application/json'
    }
  }

  private get _axios(): AxiosInstance {
    return axios.create(this._axiosConfig)
  }

  async getListeDispositif(): Promise<any | null> {
    try {
      const response = await this._axios.get<any>(`${this._baseUrl}/r2da/listeDispositif`)
      console.log(response)
      return response.data['ListeDispositifs']
    } catch (error) {
      console.error('Error fetching liste dispositif from ADEME API:', error)
      return null
    }
  }

  async getReferentiel(typeReferentiel: AdemeTypeReferentiel, code?: string): Promise<any | null> {
    try {
      const url = `${this._baseUrl}/r2da/referentiel/${typeReferentiel}${code ? `?code=${code}` : ''}`
      const response = await this._axios.get<any>(url)
      return response.data
    } catch (error) {
      console.error(`Error fetching referentiel ${typeReferentiel} from ADEME API:`, error)
      return null
    }
  }
}
