export interface BaserowProject {
  id: number
  order: string
  Nom: string
  'Description courte': string
  Image: unknown[] //TODO
  'Qu’est-ce que c’est ?': string
  'Pour aller plus loin': string
  Titre: string
  'Projets complémentaires': BaserowLinkedObject[]
  'Thématique principale': BaserowLinkedObject[]
  NameTag: string
  OK: boolean
  'Thématiques secondaires': BaserowLinkedObject[]
  Dispositifs: BaserowLinkedObject[]
}

import { Theme } from '@tee/common/src/theme/types'
export interface CoreThemeType extends Omit<Theme, 'highlightProjects'> {}

export interface BaserowLinkedObject {
  id: number
  value: string
}

import { Project } from '@tee/common/src/project/types'
export interface RawProject extends Omit<Project, 'themes' | 'mainTheme' | 'linkedProjects' | 'programs'> {
  themes: string[]
  mainTheme: string
  linkedProjects: number[]
  programs: string[]
}
