import { EstablishmentNotFoundError, Etablissement } from '../../../domain/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { EtablissementDocument } from './types'
import { ensureError } from '../../../../common/errors'
import { Result } from 'true-myth'
import { EtablissementRepository } from '../../../domain/spi'

/**
 * getEtablissement reads the API token from an environment
 * variable and get an Établissement by its siret from the Sirene API
 */
export const getEtablissement: EtablissementRepository['get'] = async (siret) => {
  const token = process.env['SIRENE_API_TOKEN'] || ''
  return requestSireneAPI(token, siret)
}

/**
 * requestSireneAPI requests data about companies, given their "siret"
 *
 * @arg token - API access token
 * @arg siret - siret number of the company to fetch
 */
export const requestSireneAPI = async (token: string, siret: string): Promise<Result<Etablissement, Error>> => {
  const api_sirene_url = `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`

  try {
    const response: AxiosResponse<EtablissementDocument> = await axios.get(api_sirene_url, {
      headers: makeHeaders(token)
    })
    return Result.ok(response.data as Etablissement)
  } catch (err: unknown) {
    let error = ensureError(err)

    if (error instanceof AxiosError) {
      if (error.response && error.response.status == 404) {
        error = new EstablishmentNotFoundError()
      }
    }

    return Result.err(error)
  }
}

/**
 * Populate headers for a call to the "SIRENE" API
 *
 * @arg token - API access token
 */
const makeHeaders = (token: string) => {
  const jsonContentType = 'application/json'
  return {
    accept: jsonContentType,
    'content-type': jsonContentType,
    authorization: `Bearer ${token}`
  }
}
