import { PublicodeObjective } from '../questionnaire/types/types'
import ThemeCommon from './theme'

export interface Theme {
  id: string
  title: string
  tagLabel: string
  value: PublicodeObjective
  image: string
  color?: string
  highlightProjects: number[]
}

export type ThemeId = (typeof ThemeCommon.themes)[number]['id']
