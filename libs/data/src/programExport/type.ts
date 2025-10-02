import { UUID } from 'crypto'
import { DataProgramType } from '../program/types/domain'

export interface schemaProgram {
  id: UUID
  titre: string
  promesse: string
  description: string
  eligibilite: string
  types_aides: SchemaAideType[]
  porteurs: Porteur[]
  programmes_parents?: string
  url_source?: string
  cibles: Cible[]
  eligibilite_geographique: string[]
  eligibilite_geographique_exclusions?: string[]
  date_ouverture?: string
  date_cloture?: string
  date_mise_a_jour: string
}

export type SchemaProgramCsv = Omit<
  schemaProgram,
  'types_aides' | 'porteurs' | 'cibles' | 'eligibilite_geographique' | 'eligibilite_geographique_exclusions'
> & {
  types_aides: string
  porteurs: string
  cibles: string
  eligibilite_geographique: string
  eligibilite_geographique_exclusions: string
}

export enum SchemaAideType {
  Assistance = 'assistance',
  AvantageFiscal = 'avantage fiscal',
  Conseil = 'conseil',
  Etude = 'étude',
  Financement = 'financement',
  Formation = 'formation',
  Information = 'information',
  Pret = 'prêt'
}

export interface Porteur {
  nom: string
  siren: string
  roles: PorteurRole[]
}

export const DataProgramTypeToTypeAide: Record<DataProgramType, SchemaAideType[]> = {
  [DataProgramType.Study]: [SchemaAideType.Etude],
  [DataProgramType.TaxAdvantage]: [SchemaAideType.AvantageFiscal],
  [DataProgramType.Financing]: [SchemaAideType.Financement],
  [DataProgramType.FinancingStudy]: [SchemaAideType.Financement, SchemaAideType.Etude],
  [DataProgramType.Loan]: [SchemaAideType.Pret],
  [DataProgramType.Training]: [SchemaAideType.Formation],
  [DataProgramType.ActionTraining]: [SchemaAideType.Formation, SchemaAideType.Assistance],
  [DataProgramType.Awareness]: [SchemaAideType.Information],
  [DataProgramType.Undefined]: []
}

export enum Cible {
  Professionnels = 'professionnels',
  Particuliers = 'particuliers',
  Associations = 'associations',
  SecteurPublic = 'secteur public'
}

export enum PorteurRole {
  Diffuseur = 'diffuseur',
  Financeur = 'financeur',
  Instructeur = 'instructeur'
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
