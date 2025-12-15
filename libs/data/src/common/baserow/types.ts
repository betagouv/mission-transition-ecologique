import { FaqPage } from '../../faq/types/shared'
import { ConditionalValues as DomainConditionalValues, DataProgram } from '../../program/types/domain'

export interface Id {
  id: number
}

interface Order {
  order: number
}
interface LastModification {
  'Dernière modification': string
}

interface LastModificationBy {
  'Dernière modification par': { id: number; name: string }
}

interface CreationDate {
  'Date de création': string
}

export interface BaserowData<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface BaserowProject extends Id, BaserowSectors, BaserowMetaData {
  order: string
  Nom: string
  'Description courte': string
  Statut: LinkObject
  Image: LinkObject[]
  Titre: string
  'Titre - Pourquoi ?': string
  'Qu’est-ce que c’est ?': string
  'Titre - Me documenter': string
  'Pour aller plus loin': string
  'Titre - Projets complémentaires': string
  'Description - Projets complémentaires': string
  'Projets complémentaires': LinkObject[]
  'Thématique principale': LinkObject[]
  NameTag: string
  'Thématiques secondaires': LinkObject[]
  Dispositifs: LinkObject[]
  Prio: number
  'Prios spécifiques': string
  'Mise En Avant': number | null
  'Titre - FAQ': string
  Faq: LinkObject[]
  'redirection-vers': LinkObject[]
}

export interface LinkObject extends Id {
  value: string
  [key: string]: unknown
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

export interface BaserowMetaData {
  'Meta Titre': string | null
  'Meta Description': string | null
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
    BaserowMetaData,
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

export interface BaserowFaq extends Id, Order {
  Question: string
  Réponse: string
  Actif: boolean
  Page: LinkObject | null
  Section: LinkObject[]
  Projet: LinkObject[]
}

export interface BaserowFaqs {
  faqs: BaserowFaq[]
}

export interface BaserowFaqSection extends Id, Order, CreationDate, LastModification, LastModificationBy {
  Titre: string
  Couleur: LinkObject
}

export interface FaqItemStructured extends BaserowFaqSection, BaserowFaqs {}

export type FaqPagesStructured = {
  [key in FaqPage]?: FaqItemStructured[]
}

export type FaqProjectsStructured = {
  [key: number]: BaserowFaqs
}

export interface BaserowContact extends Id {
  'Prénom NOM': string
  Courriel: string
}

export interface BaserowFilter {
  filter_type: 'OR' | 'AND'
  filters: { type: string; field: string; value: string | number }[]
  groups: []
}

export interface BaserowOperator {
  id: number
  Filtre: LinkObject[]
  Tag: string
  Nom: string
  siren: string
  'Nom Normalisé': string
  Image: LinkObject[]
  'Image URL TEE': string
}
