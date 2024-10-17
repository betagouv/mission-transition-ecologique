import { ThemeId } from '../../theme/types/shared'
import { projects } from '../../../static'

export interface Project {
  id: number
  title: string
  slug: string
  nameTag: string
  shortDescription: string
  image: string
  longDescription: string
  moreDescription: string
  themes: ThemeId[]
  mainTheme: ThemeId
  programs: string[]
  linkedProjects: ProjectId[]
  priority: number
  sectors: string[]
}

export type ProjectId = (typeof projects)[number]['id']

export enum SectorKeys {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N',
  O = 'O',
  P = 'P',
  Q = 'Q',
  R = 'R',
  S = 'S',
  T = 'T',
  U = 'U'
}

export type Sectors = {
  [K in SectorKeys]: boolean
}
