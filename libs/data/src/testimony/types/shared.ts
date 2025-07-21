import { ProjectId } from '../../project/types/shared'
import { ThemeId } from '../../theme/types/shared'

export interface Testimony {
  slug: string
  theme?: ThemeId[]
  verbatim: string
  companyName: string
  authorName: string
  authorFunction: string
  authorImage?: string
  authorImageAttributes: string
  externalLink: string
  projects: ProjectId[]
  programs?: string[]
  regions?: string[]
  homePageHighlight: number
}
