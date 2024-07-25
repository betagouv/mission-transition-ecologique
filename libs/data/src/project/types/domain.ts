import { Project } from './shared'

export interface RawProject extends Omit<Project, 'themes' | 'mainTheme' | 'linkedProjects' | 'programs'> {
  themes: string[]
  mainTheme: string
  linkedProjects: number[]
  programs: string[]
}
