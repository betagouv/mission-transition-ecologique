export interface RechercheEntrepriseSearch {
  results?: RechercheEntrepriseEstablishement[] | null
  total_results: number
  page: number
  per_page: number
  total_pages: number
}

export interface RechercheEntrepriseEstablishement {
  siren: string
  nom_raison_sociale: string

  siege: Siege
  activite_principale: string // NafCode
  section_activite_principale: string // NafSectionCode
  date_creation: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface Siege {
  siret: string
  code_postal: string
  commune: string //code INSEE

  libelle_commune: string
  numero_voie: string
  type_voie: string
  libelle_voie: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
