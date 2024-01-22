import { EstablishmentNotFoundError, Establishment } from '../../../domain/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { EstablishmentDocument } from './types'
import { Result } from 'true-myth'
import { EstablishmentRepository } from '../../../domain/spi'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { ensureError } from '../../../../common/domain/error/errors'

/**
 * getEstablishment reads the API token from an environment
 * variable and get an Établissement by its siret from the Sirene API
 */
export const getEstablishment: EstablishmentRepository['get'] = async (siret) => {
  const token = process.env['SIRENE_API_TOKEN'] || ''
  return requestSireneAPI(token, siret)
}

/**
 * requestSireneAPI requests data about companies, given their "siret"
 *
 * @arg token - API access token
 * @arg siret - siret number of the company to fetch
 */
export const requestSireneAPI = async (token: string, siret: string): Promise<Result<Establishment, Error>> => {
  const api_sirene_url = `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`

  try {
    const response: AxiosResponse<EstablishmentDocument> = await axios.get(api_sirene_url, {
      headers: makeHeaders(token)
    })
    return Result.ok(parseEstablishment(response.data))
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

const parseEstablishment = (establishmentDocument: EstablishmentDocument): Establishment => {
  const establishment = establishmentDocument.etablissement
  return {
    siren: establishment.siren,
    nic: establishment.nic,
    siret: establishment.siret,
    creationDate: establishment.uniteLegale.dateCreationUniteLegale,
    denomination: establishment.uniteLegale.denominationUniteLegale,
    nafCode: establishment.uniteLegale.activitePrincipaleUniteLegale,
    address: {
      streetNumber: establishment.adresseEtablissement.numeroVoieEtablissement,
      streetType: establishment.adresseEtablissement.typeVoieEtablissement,
      streetLabel: establishment.adresseEtablissement.libelleVoieEtablissement,
      zipCode: establishment.adresseEtablissement.codePostalEtablissement,
      cityLabel: establishment.adresseEtablissement.libelleCommuneEtablissement,
      cityCode: establishment.adresseEtablissement.codeCommuneEtablissement
    }
  }
}

/**
 * Populate headers for a call to the "SIRENE" API
 *
 * @arg token - API access token
 */
const makeHeaders = (token: string) => {
  return {
    ...AxiosHeaders.makeJsonHeader(),
    ...AxiosHeaders.makeBearerHeader(token)
  }
}
