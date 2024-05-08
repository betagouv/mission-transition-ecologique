import EstablishmentFront from '@tee/common/src/establishement/types'

export type EstablishmentType = EstablishmentFront

export function isEstablishmentType(obj: unknown): obj is EstablishmentType {
  const keys = ['siret', 'codeNAF', 'codeNAF1', 'ville', 'codePostal', 'region', 'structure_size', 'denomination', 'secteur']
  return typeof obj === 'object' && obj !== null && keys.every((key) => key in obj)
}
