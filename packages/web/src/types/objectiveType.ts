import { PublicodeObjective } from '@/types'

export interface ObjectiveType {
  id: string
  title: string
  tagLabel: string
  value: PublicodeObjective
  image: string
  color?: string
  highlightProjects: number[]
  displayDots: boolean
}
