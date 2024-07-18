import { DataProgram } from '../../program/types'

export interface Project {
  id: number
  order: string
  Nom: string
  'Description courte': string
  Image: LinkedObject[]
  'Qu’est-ce que c’est ?': string
  'Pour aller plus loin': string
  Titre: string
  'Projets complémentaires': LinkedObject[]
  'Thématique principale': LinkedObject[]
  NameTag: string
  Publié: boolean
  'Thématiques secondaires': LinkedObject[]
  Dispositifs: LinkedObject[]
  Prio: number
}

export interface Id {
  id: number
}
export interface LinkedObject {
  id: number
  value: string
}

export interface ImageTable {
  id: number
  Titre: string
  'Alt-text': string
  Image: Image[]
  'Image URL TEE': string
}

export interface Image {
  url: string
}

export interface Program
  extends Omit<
    DataProgram,
    | 'Statuts'
    | "Nature de l'aide"
    | 'Opérateur de contact'
    | 'Autres opérateurs'
    | 'Couverture géographique'
    | 'Zones géographiques'
    | 'Thèmes Ciblés'
  > {
  Statuts: LinkedObject[]
  "Nature de l'aide": LinkedObject
  'Opérateur de contact': LinkedObject[]
  'Autres opérateurs': LinkedObject[]
  'Couverture géographique': LinkedObject[]
  'Zones géographiques': LinkedObject[]
  'Thèmes Ciblés': LinkedObject[]
}
