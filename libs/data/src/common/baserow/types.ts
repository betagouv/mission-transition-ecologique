import { DataProgram } from '../../program/types/domain'

export interface Id {
  id: number
}

export type Sectors = {
  [K in
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U']: boolean
}

export interface Project extends Id, Sectors {
  order: string
  Nom: string
  'Description courte': string
  Image: LinkObject[]
  'Qu’est-ce que c’est ?': string
  'Pour aller plus loin': string
  Titre: string
  'Projets complémentaires': LinkObject[]
  'Thématique principale': LinkObject[]
  NameTag: string
  Publié: boolean
  'Thématiques secondaires': LinkObject[]
  Dispositifs: LinkObject[]
  Prio: number
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
  name: string
  uploaded_at: string
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
  Statuts: LinkObject[]
  "Nature de l'aide": LinkObject
  'Opérateur de contact': LinkObject[]
  'Autres opérateurs': LinkObject[]
  'Couverture géographique': LinkObject[]
  'Zones géographiques': LinkObject[]
  'Thèmes Ciblés': LinkObject[]
}
