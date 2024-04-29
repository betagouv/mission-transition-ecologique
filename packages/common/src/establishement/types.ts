export interface EstablishmentId {
  siret: string
}

export interface EstablishementDisplay extends EstablishmentId {
  creationDate: string
  address: string
  sector: string
  name: string
  region: string
}
