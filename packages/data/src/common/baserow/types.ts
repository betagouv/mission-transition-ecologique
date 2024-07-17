import { Program as DataProgram } from "../../programs/types"

export interface Project {
  id: number
  order: string
  Nom: string
  'Description courte': string
  Image: Image[]
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

export enum ThemeType {
  Building = 'building',
  Mobility = 'mobility',
  Waste = 'waste',
  Water = 'water',
  Energy = 'energy',
  RH = 'rh',
  Environmental = 'environmental',
  EcoDesign = 'eco-design'
}
export interface Theme {
  id: number
  Nom: string
  'Nom (Tech)': ThemeType
}

export interface Id {
  id: number
}
export interface LinkedObject {
  id: number
  value: string
}

export interface Image {
  url: string
  thumbnails: Thumbnails
}

interface Thumbnails {
  tiny: Thumbnail
  small: Thumbnail
}

interface Thumbnail {
  url: string
  width: number
  height: number
}

export interface Program extends Omit<
  DataProgram,
  'Statuts' | "Nature de l'aide" | 'Opérateur de contact' | 'Autres opérateurs' | 'Couverture géographique' | 'Zones géographiques' | 'Thèmes Ciblés'> {
  Statuts: LinkedObject[],
  "Nature de l'aide": LinkedObject,
  'Opérateur de contact': LinkedObject[],
  'Autres opérateurs': LinkedObject[],
  'Couverture géographique': LinkedObject[],
  'Zones géographiques': LinkedObject[],
  'Thèmes Ciblés': LinkedObject[]
}
