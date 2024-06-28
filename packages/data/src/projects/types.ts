import { Theme } from '@tee/common/src/theme/types'

export interface CoreThemeType extends Omit<Theme, 'highlightProjects'> {}

import { Project } from '@tee/common/src/project/types'

export interface RawProject extends Omit<Project, 'themes' | 'mainTheme' | 'linkedProjects' | 'programs'> {
  themes: string[]
  mainTheme: string
  linkedProjects: number[]
  programs: string[]
}
