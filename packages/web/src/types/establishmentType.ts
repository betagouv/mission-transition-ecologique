export default interface EstablishmentType {
  siret: string
  codeNaf: string
  codeNAF1: string
  ville: string
  codePostal: string
  region: string | null
  structure_sizes: string
  denomination: string | null
  secteur: string | undefined
}

export function isEstablishmentType(obj: unknown): obj is EstablishmentType {
  const keys = ['siret', 'codeNaf', 'codeNAF1', 'ville', 'codePostal', 'région', 'structure_sizes', 'denomination', 'secteur']
  return typeof obj === 'object' && obj !== null && keys.every((key) => key in obj)
}
