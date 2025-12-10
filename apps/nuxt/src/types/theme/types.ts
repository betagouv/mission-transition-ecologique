import { Color, ThemeId } from '@/types'

export interface ThemeType {
  id: ThemeId
  title: string
  tagLabel: string
  slug: string
  image: string
  color: Color
  titleColor?: Color
}
