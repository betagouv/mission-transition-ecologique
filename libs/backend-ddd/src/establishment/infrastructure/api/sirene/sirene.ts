import { EstablishmentNotFoundError, EstablishmentDetails } from '../../../domain/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { EstablishmentDocument } from './types'
import { Result } from 'true-myth'
import { EstablishmentRepository } from '../../../domain/spi'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { ensureError } from '../../../../common/domain/error/errors'
import Monitor from '../../../../common/domain/monitoring/monitor'

/**
 * getEstablishment reads the API token from an environment
 * variable and get an Établissement by its siret from the Sirene API
 */
export const getEstablishment: EstablishmentRepository['get'] = async (siret) => {
  const token = process.env['SIRENE_API_311_TOKEN'] || ''
  return requestSireneAPI(token, siret)
}

/**
 * requestSireneAPI requests data about companies, given their "siret"
 *
 * @arg token - API access token
 * @arg siret - siret number of the company to fetch
 */
export const requestSireneAPI = async (token: string, siret: string): Promise<Result<EstablishmentDetails, Error>> => {
  const api_sirene_url = `https://api.insee.fr/api-sirene/3.11/siret/${siret}`

  try {
    const response: AxiosResponse<EstablishmentDocument> = await axios.get(api_sirene_url, {
      headers: makeHeaders(token),
      timeout: 3000
    })
    return Result.ok(parseEstablishment(response.data))
  } catch (err: unknown) {
    let error = ensureError(err)
    Monitor.exception(error, { query: siret })

    if (error instanceof AxiosError) {
      if (error.response && error.response.status == 404) {
        error = new EstablishmentNotFoundError()
      }
    }

    return Result.err(error)
  }
}

const parseEstablishment = (establishmentDocument: EstablishmentDocument): EstablishmentDetails => {
  const rawEstablishment = establishmentDocument.etablissement
  const result: EstablishmentDetails = {
    siren: rawEstablishment.siren,
    nic: rawEstablishment.nic,
    siret: rawEstablishment.siret,
    denomination: rawEstablishment.uniteLegale.denominationUniteLegale,
    creationDate: rawEstablishment.uniteLegale.dateCreationUniteLegale,
    nafCode: rawEstablishment.uniteLegale.activitePrincipaleUniteLegale,
    legalCategory: rawEstablishment.uniteLegale.categorieJuridiqueUniteLegale,
    address: {
      streetNumber: rawEstablishment.adresseEtablissement.numeroVoieEtablissement,
      streetType: rawEstablishment.adresseEtablissement.typeVoieEtablissement,
      streetLabel: rawEstablishment.adresseEtablissement.libelleVoieEtablissement,
      zipCode: rawEstablishment.adresseEtablissement.codePostalEtablissement,
      cityLabel: rawEstablishment.adresseEtablissement.libelleCommuneEtablissement,
      cityCode: rawEstablishment.adresseEtablissement.codeCommuneEtablissement
    },
    workforceRange: rawEstablishment.trancheEffectifsEtablissement
  }

  return result
}

/**
 * Populate headers for a call to the "SIRENE" API
 *
 * @arg token - API access token
 */
const makeHeaders = (token: string) => {
  return {
    ...AxiosHeaders.makeJsonHeader(),
    ...{ 'X-INSEE-Api-Key-Integration': token }
  }
}
