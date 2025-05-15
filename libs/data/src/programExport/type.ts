import { UUID } from 'crypto'

export interface schemaProgram {
  id_aide: UUID
  nom: string
  promesse: string
  description_courte: string
  description_longue: string
  programme_aides?: string
  porteur_aide: string
  porteur_siren: string
  beneficiaires_aide?: string
  types_aides: string
  montant_aide_ou_cout: string
  duree_aide?: string
  projet_reference: string
  exemple_projet?: string
  thematique_aide: string
  date_ouverture?: string
  date_releve_intermediaire?: string
  date_cloture?: string
  url_source: string
  contact_question: string
  activation_etape_1: string
  activation_etape_1_liens?: string
  activation_etape_2?: string
  activation_etape_2_liens?: string
  activation_etape_3?: string
  activation_etape_3_liens?: string
  activation_etape_4?: string
  activation_etape_4_liens?: string
  activation_etape_5?: string
  etape_activation_5_liens?: string
  activation_etape_6?: string
  activation_etape_6_liens?: string
  eligibilite_geographique: string
  eligibilite_geographique_exclusions?: string
  eligibilite_sectorielle: string
  eligibilite_sectorielle_naf: string
  eligibilite_sectorielle_exclusions?: string
  eligibilite_effectif: string
  eligibilite_effectif_min?: number
  eligibilite_effectif_max?: number
  eligibilite_existence?: string
  eligibilite_existence_min?: number
  eligibilite_existence_max?: number
  eligibilite_statuts_specifiques?: string
  eligibilite_statuts_exclus?: string
  eligibilite_autre?: string
  date_mise_a_jour: string
}

export const COG_MAPPING: Record<string, string> = {
  // 🇫🇷 Country
  France: 'PAYS-99100',

  // 🌍 Regions
  Guadeloupe: 'REG-01',
  Martinique: 'REG-02',
  Guyane: 'REG-03',
  'La Réunion': 'REG-04',
  Mayotte: 'REG-06',
  'Île-de-France': 'REG-11',
  'Centre-Val de Loire': 'REG-24',
  'Bourgogne-Franche-Comté': 'REG-27',
  Normandie: 'REG-28',
  'Hauts-de-France': 'REG-32',
  'Grand Est': 'REG-44',
  'Pays de la Loire': 'REG-52',
  Bretagne: 'REG-53',
  'Nouvelle-Aquitaine': 'REG-75',
  Occitanie: 'REG-76',
  'Auvergne-Rhône-Alpes': 'REG-84',
  "Provence-Alpes-Côte d'Azur": 'REG-93',
  Corse: 'REG-94',

  // 🏞️ Departments / Collectivité d'outre-mer
  'Alpes-de-Haute-Provence': 'DEP-04',
  'Hautes-Alpes': 'DEP-05',
  'Alpes-Maritimes': 'DEP-06',
  'Bouches-du-Rhône': 'DEP-13',
  Var: 'DEP-83',
  Vaucluse: 'DEP-84',
  'Eure-et-Loir': 'DEP-28',
  Loiret: 'DEP-45',
  Landes: 'DEP-40',
  'Seine-et-Marne': 'DEP-77',
  Jura: 'DEP-39',
  'Saint-Martin': 'DEP-978',
  'Nouvelle-Calédonie': 'COM-988',
  'Polynésie française': 'COM-987',
  'Saint-Barthélemy': 'COM-977',
  'Saint-Pierre-Et-Miquelon': 'COM-975'
}
