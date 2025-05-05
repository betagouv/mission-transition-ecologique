import { UUID } from 'crypto'

export interface schemaProgram {
  id_aide: UUID
  nom: string
  promesse: string
  description_courte: string
  description_longue: string
  debut_de_validite?: string
  fin_de_validite?: string
  url_source: string
  illustration?: string
  thematique_aide: string
  etape_activation_1: string
  etape_activation_1_liens?: string
  etape_activation_2?: string
  etape_activation_2_liens?: string
  etape_activation_3?: string
  etape_activation_3_liens?: string
  etape_activation_4?: string
  etape_activation_4_liens?: string
  etape_activation_5?: string
  etape_activation_5_liens?: string
  etape_activation_6?: string
  etape_activation_6_liens?: string
  contact_question?: string
  programme_aides?: string
  porteurs_aide: string
  porteur_siren: string
  types_aides: string
  type_depense?: string
  montant_aide_ou_cout: string
  duree_aide?: string
  beneficiaires_aide?: string
  eligibilite_geographique: string
  eligibilite_sectorielle: string
  eligibilite_effectif: string
  eligibilite_autre?: string
  cible: string
}
