import { ThemeId } from '@tee/common'
import { projects } from '../../../static'

export interface ProjectType {
  id: number
  title: string
  slug: string
  nameTag: string
  countEligiblePrograms: number
  shortDescription: string
  image: string
  longDescription: string
  moreDescription: string
  themes: ThemeId[]
  mainTheme: ThemeId
  programs: string[]
  linkedProjects: ProjectId[]
  priority: Record<string, number>
  highlightPriority: number | null
  sectors: string[]
  metaTitle?: string
  metaDescription?: string
}

export type ProjectId = (typeof projects)[number]['id']
