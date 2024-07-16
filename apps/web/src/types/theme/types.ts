import { Color, ThemeId, PublicodeObjective } from '@/types'

export interface ThemeType {
  id: ThemeId
  title: string
  tagLabel: string
  value: PublicodeObjective
  image: string
  color: Color
}
