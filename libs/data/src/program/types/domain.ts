import { ProgramType } from './shared'
import { BaserowSectors, BaserowMetaData } from '../../common/baserow/types'
import { Theme } from '../../theme/types/domain'
import { Contact } from '../../common/types'

export interface DataProgram extends BaserowSectors, BaserowMetaData {
  id: number
  'Id fiche dispositif': string
  Titre: string
  Promesse: string
  'Description courte': string
  'Description longue': string
  'Contact Question': string
  'Opérateur de contact': Operator[]
  'Dispositif activable en autonomie': boolean
  'URL externe': string
  "Montant de l'aide ou coût": string
  "Durée de l'aide": string
  DISPOSITIF_DATE_DEBUT: string
  DISPOSITIF_DATE_FIN: string
  'Zones Spécifiques (géographie)': string
  'Eligibilité Taille': string
  minEff: number
  maxEff: number
  microEntrepreneur: string
  'Eligibilité Existence': string
  'Eligibilité Naf': string
  'Eligibilité Sectorielle': string
  Propriétaire: string
  'Autres opérateurs': Operator[]
  'Couverture géographique': GeographicCoverage
  'Zones géographiques': GeographicAreas[]
  'Eligibilité Spécifique': string
  'Thèmes Ciblés': Theme[]
  étape1: string
  étape2: string
  étape3: string
  étape4: string
  étape5: string
  étape6: string
  "Nature de l'aide": DataProgramType
  Statuts: Status[]
  conditionalData?: ConditionalValues[]
  'redirection-vers': number[]
  tech: string
  internalContact?: Contact
}

export enum Publicodes {
  CIBLE = 'entreprise . est ciblée',
  ELIGIBLE = 'entreprise . est éligible',
  OBJECTIF = 'entreprise . a un objectif ciblé',
  SECTEUR = "entreprise . est dans un secteur d'activité ciblé",
  ZONE_GEO = 'entreprise . est dans une zone géographique éligible',
  EFFECTIF = 'entreprise . a un effectif éligible',
  LEGALCATEGORY = 'entreprise . a une categorie legale eligible',
  PROPRIO = 'entreprise . est propriétaire de ses locaux',
  ALL = 'toutes ces conditions',
  ANY = 'une de ces conditions'
}

export interface YamlImage {
  illustration: string
}

export interface YamlObjective {
  description: string
  liens?: (Lien | Formulaire)[]
}

export interface Lien {
  lien: string
  texte: string
}
export interface Formulaire {
  formulaire: boolean
}

export type ConditionalYaml = Required<ProgramType['champs conditionnels'][]>[number][number]

export interface Operator {
  id: number
  Tag: string
  Nom: string
}

export interface GeographicCoverage {
  id: number
  Name: string
}

export interface GeographicAreas {
  id: number
  Name: string
}

export enum DataProgramType {
  Study = 'étude',
  TaxAdvantage = 'Avantage fiscal',
  Financing = 'Financement',
  FinancingStudy = 'Financement-étude',
  Loan = 'Prêt',
  Training = 'Formation',
  ActionTraining = 'Formation-Action',
  Awareness = 'Sensibilisation',
  Undefined = 'Undefined'
}

export enum Status {
  InProd = 'En prod',
  InProdNotAvailable = 'Temporairement indispo',
  Replaced = 'Remplacé',
  Other = 'Autres'
}

export type ConditionalValues = CompanySizeCondition | RegionCondition

export interface CompanySizeCondition extends ModifiableFields {
  'Type de condition': 'nombre de salariés'
  'Condition: nb min salaries': number
  'Condition: nb max salaries': number
}

export interface RegionCondition extends ModifiableFields {
  'Type de condition': 'géographique'
  'valeur de la condition géographique': GeographicAreas[]
}

interface ModifiableFields {
  'Dispositif concerné': string
  'Opérateur de contact': Operator[]
  'Autres opérateurs': Operator[]
  'URL externe': string
  "Montant de l'aide ou coût": string
  "Durée de l'aide": string
  'Eligibilité taille': string
  'Eligibilité Spécifique': string
}

export interface MailSenderInterface {
  sendInitialMail(program: DataProgram): Promise<void>
  sendPeriodicMail(program: DataProgram): Promise<void>
  sendEolMail(program: DataProgram): Promise<void>
}

export enum Region {
  AuvergneRhoneAlpes = 'Auvergne-Rhône-Alpes',
  BourgogneFrancheComte = 'Bourgogne-Franche-Comté',
  Bretagne = 'Bretagne',
  CentreValDeLoire = 'Centre-Val de Loire',
  Corse = 'Corse',
  GrandEst = 'Grand Est',
  HautsDeFrance = 'Hauts-de-France',
  Normandie = 'Normandie',
  NouvelleAquitaine = 'Nouvelle-Aquitaine',
  Occitanie = 'Occitanie',
  ProvenceAlpesCoteDAzur = "Provence-Alpes-Côte d'Azur",
  PaysDeLaLoire = 'Pays de la Loire',
  IleDeFrance = 'Île-de-France',
  Guadeloupe = 'Guadeloupe',
  Guyane = 'Guyane',
  LaReunion = 'La Réunion',
  Martinique = 'Martinique',
  Mayotte = 'Mayotte',
  IleDeClipperton = 'Ile de Clipperton',
  NouvelleCaledonie = 'Nouvelle-Calédonie',
  PolynesieFrancaise = 'Polynésie française',
  SaintBarthelemy = 'Saint-Barthélemy',
  SaintMartin = 'Saint-Martin',
  SaintPierreEtMiquelon = 'Saint-Pierre-Et-Miquelon',
  TerresAustralesEtAntarctiquesFrancaises = 'Terres australes et antarctiques françaises',
  WallisEtFutuna = 'Wallis et Futuna'
}
