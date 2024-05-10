import { StructureSize } from '@tee/common/src/questionnaire/types/types'
export default interface EstablishmentType {
  siret: string
  codeNAF: string
  codeNAF1: string
  ville: string
  codePostal: string
  region: string | undefined
  structure_size: StructureSize | undefined
  denomination: string | undefined
  secteur: string | undefined
  creationDate: string
}

export function isEstablishmentType(obj: unknown): obj is EstablishmentType {
  const keys = ['siret', 'codeNAF', 'codeNAF1', 'ville', 'codePostal', 'region', 'structure_size', 'denomination', 'secteur']
  return typeof obj === 'object' && obj !== null && keys.every((key) => key in obj)
}
