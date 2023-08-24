import { Etablissement } from '../domain/types.js'
import axios, { AxiosResponse } from 'axios'
import { Result } from 'true-myth'
import { EtablissementDocument } from './types.js'
import { ensureError } from './helpers.js'

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

/**
 * requestSireneAPI requests data about companies, given their "siret"
 *
 * @arg siret - siret number of the company to fetch
 * @arg token - API access token
 */
export const requestSireneAPI = async (
  siret: string,
  token: string
): Promise<Result<Etablissement, Error>> => {
  const api_sirene_url = `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`

  try {
    const response: AxiosResponse<EtablissementDocument> = await axios.get(api_sirene_url, {
      headers: makeHeaders(token)
    })
    return Result.ok(response.data as Etablissement)
  } catch (err: unknown) {
    const error = ensureError(err)

    return Result.err(error)
  }
}
