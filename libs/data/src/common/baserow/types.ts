import { ConditionalValues as DomainConditionalValues, DataProgram } from '../../program/types/domain'

export interface Id {
  id: number
}

export interface BaserowProject extends Id, BaserowSectors {
  order: string
  Nom: string
  'Description courte': string
  Statut: LinkObject
  Image: LinkObject[]
  'Qu’est-ce que c’est ?': string
  'Pour aller plus loin': string
  Titre: string
  'Projets complémentaires': LinkObject[]
  'Thématique principale': LinkObject[]
  NameTag: string
  'Thématiques secondaires': LinkObject[]
  Dispositifs: LinkObject[]
  Prio: number
  'Mise En Avant': number | null
  'redirection-vers': LinkObject[]
}

export interface LinkObject extends Id {
  value: string
}

export interface ImageTable extends Id {
  Titre: string
  'Alt-text': string
  Image: Image[]
  'Image URL TEE': string
}

export interface Image {
  url: string
  visible_name: string
  uploaded_at: string
}

export interface Program
  extends Omit<
      DataProgram,
      | keyof Sectors
      | 'Statuts'
      | "Nature de l'aide"
      | 'Opérateur de contact'
      | 'Autres opérateurs'
      | 'Couverture géographique'
      | 'Zones géographiques'
      | 'Thèmes Ciblés'
      | 'redirection-vers'
      | 'contact'
    >,
    BaserowSectors,
    ProgramTechSerialized {
  Statuts: LinkObject[]
  "Nature de l'aide": LinkObject
  'Opérateur de contact': LinkObject[]
  'Autres opérateurs': LinkObject[]
  'Couverture géographique': LinkObject[]
  'Zones géographiques': LinkObject[]
  'Thèmes Ciblés': LinkObject[]
  'redirection-vers': LinkObject[]
  'Référent Interne': LinkObject[]
}

export interface ProgramTechSerialized {
  tech: string
}

export interface Operator {
  Nom: string
  Tag: string
  Filtre: LinkObject[]
}

export interface ConditionalValues
  extends Omit<
    DomainConditionalValues,
    'Dispositif concerné' | 'Type de condition' | 'valeur de la condition géographique' | 'Opérateur de contact' | 'Autres opérateurs'
  > {
  'Dispositif concerné': LinkObject[]
  'Type de condition': LinkObject
  'valeur de la condition géographique': LinkObject[]
  'Opérateur de contact': LinkObject[]
  'Autres opérateurs': LinkObject[]
  'Condition: nb min salaries': number
  'Condition: nb max salaries': number
}

export enum SectorKeys {
  'AAgriculture, sylviculture et pêche' = 'A',
  'BIndustries extractives' = 'B',
  'CIndustrie manufacturière' = 'C',
  "DProduction et distribution d'électricité, de gaz, de vapeur et d'air conditionné" = 'D',
  "EProduction et distribution d'eau, assainissement, gestion des déchets et dépollution" = 'E',
  FConstruction = 'F',
  "GCommerce, réparation d'automobiles et de motocycles" = 'G',
  'HTransports et entreposage' = 'H',
  'IHébergement et restauration' = 'I',
  'JInformation et communication' = 'J',
  "KActivités financières et d'assurance" = 'K',
  'LActivités immobilières' = 'L',
  'MActivités spécialisées, scientifiques et techniques' = 'M',
  'NActivités de services administratifs et de soutien' = 'N',
  'OAdministration publique' = 'O',
  PEnseignement = 'P',
  'QSanté humaine et action sociale' = 'Q',
  'RArts, spectacles et activités récréatives' = 'R',
  'SAutres activités de services' = 'S',
  "TActivités des ménages en tant qu'employeurs, activités indifférenciées des ménages en tant que producteurs de biens et services pour usage propre" = 'T',
  'UActivités extra-territoriales' = 'U'
}

export type Sectors = {
  [K in SectorKeys]: boolean
}

export type BaserowSectors = {
  [K in keyof typeof SectorKeys]: boolean
}

export interface BaserowTestimony extends Id, BaserowSectors {
  'Id fiche témoignage': string
  Statut: LinkObject
  Theme: LinkObject
  Verbatim: string
  "Fonction + nom de l'entreprise": string
  'Prénom NOM': string
  Photo: Image[]
  "attribut de l'image": string
  'Lien externe vers le témoignage': string
  Projets: LinkObject[]
  Dispositifs: LinkObject[]
  Région: LinkObject[]
  'Mise en avant': number
  'Nom entreprise': string
}

export interface BaserowTraining extends Id {
  'Id Ademe': string
  'Futures Sessions': string
  Titre: string
  Promesse: string
  'Url ADEME': string
  Objectifs: string
  Thématique: string
  'Nombre de sessions à venir': number
  'Nombre de participants par session': string
  Modalité: string
  'Codes Sections': string
  Cible: string
  Programme: string
  Prérequis: string
  Tarif: string
  Durée: string
  'Nombre de jours': string
}

export interface ProgramTechnicalInfo {
  prod_release_date?: string
  email_enable?: boolean
  last_mail_sent_date?: string
  eol_mail_sent_date?: string
}

export interface BaserowContact extends Id {
  'Prénom NOM': string
  Courriel: string
}
