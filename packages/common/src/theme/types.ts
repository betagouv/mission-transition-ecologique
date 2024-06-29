import { PublicodeObjective } from '../questionnaire/types/types'
import ThemesValue from './theme'

export interface Theme {
  id: string
  title: string
  tagLabel: string
  value: PublicodeObjective
  image: string
  color?: string
}

export type ThemeId = (typeof ThemesValue.themes)[number]['id']
