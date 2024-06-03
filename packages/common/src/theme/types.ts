import { PublicodeObjective } from '../questionnaire/types/types'

export interface Theme {
  title: string
  tagLabel: string
  value: PublicodeObjective
  image: string
  color?: string
  highlightProjects: number[]
  displayDots: boolean
}
