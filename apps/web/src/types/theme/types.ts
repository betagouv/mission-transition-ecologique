import { Color, ThemeId } from '@/types'

export interface ThemeType {
  id: ThemeId
  title: string
  tagLabel: string
  image: string
  color: Color
}
