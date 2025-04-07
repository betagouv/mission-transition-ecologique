import { ProjectType } from './shared'

export interface DataProject
  extends Omit<
    ProjectType,
    'themes' | 'mainTheme' | 'linkedProjects' | 'programs' | 'countEligiblePrograms' | 'redirection-vers' | 'Publié_new'
  > {
  themes: string[]
  mainTheme: string
  linkedProjects: number[]
  programs: string[]
  redirectTo?: number
  status: ProjectStatuts
}

export enum ProjectStatuts {
  InProd = 'publié',
  Archived = 'archivé',
  Others = 'autre'
}
