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

export interface AdemeProgramBaserow {
  'Id fiche dispositif': string
  Titre: string
  'Description courte': string
  'Description longue': string
  r2daId: string
  'URL R2DA': string
  "type d'aide (ADEME)": string
  'type de projet (ADEME)': string
  'theme (ADEME)': string
  DISPOSITIF_DATE_DEBUT: string
  DISPOSITIF_DATE_FIN: string
  'Couverture géographique': string
  'Zones Geo': string
  Eligibilité: string
  'Zones Geo Link': number[]
  'Données brutes': string
  'Contact URL (auto)': string
  idDSP: string
}
