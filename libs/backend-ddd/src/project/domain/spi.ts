import { ProjectType } from '@tee/data'

export interface ProjectEligibilityInterface {
  isEligible(project: ProjectType, codeNAF1: string): boolean
}

export interface ProjectSorterInterface {
  sortByPriority(projects: ProjectType[]): ProjectType[]

  sortBySector(projects: ProjectType[]): ProjectType[]
}
