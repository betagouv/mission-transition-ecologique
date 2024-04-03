export default interface EstablishmentType {
  siret: string
  codeNAF: string
  codeNAF1: string
  ville: string
  codePostal: string
  region: string | null
  structure_size: string
  denomination: string | null
  secteur: string | undefined
}

export function isEstablishmentType(obj: unknown): obj is EstablishmentType {
  const keys = ['siret', 'codeNAF', 'codeNAF1', 'ville', 'codePostal', 'region', 'structure_size', 'denomination', 'secteur']
  return typeof obj === 'object' && obj !== null && keys.every((key) => key in obj)
}
