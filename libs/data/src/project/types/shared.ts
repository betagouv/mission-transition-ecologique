import { ThemeId } from '@tee/common'
import { projects } from '../../../static'
import { FaqSectionType } from '../../faq/types/shared'

export interface ProjectType {
  id: number
  title: string
  slug: string
  nameTag: string
  countEligiblePrograms: number
  shortDescription: string
  image: string
  titleLongDescription?: string
  longDescription: string
  titleMoreDescription?: string
  moreDescription: string
  themes: ThemeId[]
  mainTheme: ThemeId
  programs: string[]
  titleLinkedProjects?: string
  descriptionLinkedProjects?: string
  linkedProjects: ProjectId[]
  titleFaq?: string
  priority: number
  highlightPriority: number | null
  sectors: string[]
  metaTitle?: string
  metaDescription?: string
  faqs: FaqSectionType[]
}

export type ProjectId = (typeof projects)[number]['id']
