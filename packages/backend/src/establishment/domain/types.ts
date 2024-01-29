import CustomError from '../../common/domain/error/customError'

export type Siret = string

export interface Establishment {
  siren: string
  nic: string
  siret: string
  creationDate: string
  denomination: string
  nafCode: string
  address: {
    streetNumber: string
    streetType: string
    streetLabel: string
    zipCode: string
    cityLabel: string
    // Code officiel géographique de l'INSEE
    // https://www.insee.fr/fr/information/2560452
    cityCode: string
  }
}

export class EstablishmentNotFoundError extends CustomError {}
