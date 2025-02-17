import { ProjectType } from './shared'

export interface DataProject extends Omit<ProjectType, 'themes' | 'mainTheme' | 'linkedProjects' | 'programs' | 'countEligiblePrograms'> {
  themes: string[]
  mainTheme: string
  linkedProjects: number[]
  programs: string[]
}
