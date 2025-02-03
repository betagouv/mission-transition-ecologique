import { ProjectType } from '@tee/data'

export interface ProjectEligibilityInterface {
  isEligible(project: ProjectType, codeNAF1: string): boolean
}

export interface ProjectSorterInterface {
  sortBySector(projects: ProjectType[]): ProjectType[]
}
