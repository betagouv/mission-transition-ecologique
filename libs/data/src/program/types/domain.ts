import { Theme } from '../../theme/types/domain'

export interface DataProgram {
  id: number
  'Id fiche dispositif': string
  Titre: string
  Promesse: string
  'Description courte': string
  'Description longue': string
  'Opérateur de contact': Operator[]
  'Dispositif activable en autonomie': boolean
  'Parcours "Je ne sais pas par où commencer"': boolean
  'URL externe': string
  "Montant de l'aide ou coût": string
  "Durée de l'aide": string
  DISPOSITIF_DATE_DEBUT: string
  DISPOSITIF_DATE_FIN: string
  'Zones Spécifiques (géographie)': string
  'Eligibilité Taille': string
  minEff: number
  maxEff: number
  microEntreprise: string
  'Eligibilité Existence': string
  'Eligibilité Naf': string
  'Eligibilité Sectorielle': string
  Propriétaire: string
  AAgriculture: string
  'BIndustries extractives': string
  CIndustrie: string
  "DProduction et distribution d'électricité, de gaz, de vapeur et d'air conditionné": string
  "EProduction et distribution d'eau, assainissement, gestion des déchets et dépollution": string
  FConstruction: string
  "GCommerce, réparation d'automobiles et de motocycles": string
  HTransports: string
  IHébergement: string
  JInformation: string
  KActivités: string
  LActivités: string
  MActivités: string
  NActivités: string
  OAdministration: string
  PEnseignement: string
  QSanté: string
  RArts: string
  SAutres: string
  TActivités: string
  UActivités: string
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
}

export enum Publicodes {
  CIBLE = 'entreprise . est ciblée',
  ELIGIBLE = 'entreprise . est éligible',
  OBJECTIF = 'entreprise . a un objectif ciblé',
  SECTEUR = "entreprise . est dans un secteur d'activité ciblé",
  ZONE_GEO = 'entreprise . est dans une zone géographique éligible',
  EFFECTIF = 'entreprise . a un effectif éligible',
  PARCOURS_OBJ_PRECIS = 'questionnaire . parcours = objectif précis',
  PROPRIO = 'entreprise . est propriétaire de ses locaux',
  ALL = 'toutes ces conditions',
  ANY = 'une de ces conditions'
}

export interface YamlImage {
  illustration: string
}

export interface YamlObjective {
  description: string
  liens?: { lien: string; texte: string }[]
}

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
  UxWritingValid = 'UX writing valid',
  TaxAdvantage = 'Data valid',
  ReadyForProd = 'Prêt pour la prod',
  InProd = 'En prod'
}

export interface ConditionalValues {
  'Dispositif concerné': string
  'Type de condition': string
  'valeur de la condition géographique': GeographicAreas[]
  'Condition: nb min salaries': number
  'Condition: nb max salaries': number
  'Opérateur de contact': Operator[]
  'Autres opérateurs': Operator[]
  'URL externe': string
  "Montant de l'aide ou coût": string
  "Durée de l'aide": string
  'Eligibilité taille': string
  'Eligibilité Spécifique': string
}
