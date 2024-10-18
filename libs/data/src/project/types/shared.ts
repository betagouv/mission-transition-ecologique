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
