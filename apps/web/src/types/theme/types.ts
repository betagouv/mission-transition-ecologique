import { Color, ThemeId, Objective } from '@/types'

export interface ThemeType {
  id: ThemeId
  title: string
  tagLabel: string
  value: Objective
  image: string
  color: Color
}
