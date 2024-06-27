import { ProjectId } from '@/project/types'
import { PublicodeObjective } from '@tee/common'
import ThemeCommon from './theme'

export interface ThemeType {
  id: string
  title: string
  tagLabel: string
  value: PublicodeObjective
  image: string
  color?: string
  highlightProjects: ProjectId[]
}

export type ThemeId = (typeof ThemeCommon.themes)[number]['id']
