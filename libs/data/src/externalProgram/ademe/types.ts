export interface AdemeDispositif {
  // Add your specific type fields based on the API response
  // This is a placeholder - update with actual response structure
  id: string
  [key: string]: unknown
}

export interface AdemeApiResponse<T> {
  data?: T
  error?: string
  [key: string]: unknown
}

export enum AdemeTypeReferentiel {
  CIBLE = 'cible',
  COUVGEO = 'couvgeo',
  FINANCEMENT = 'financement',
  FONDS = 'fonds',
  SOUSTYPE = 'soustype',
  THEMATIQUE = 'thematique',
  TYPEPROJET = 'typeprojet',
  ZONEGEO = 'zonegeo',
  TYPEDOCUMENT = 'typedocument'
}
