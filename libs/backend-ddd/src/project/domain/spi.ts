import { ProjectType } from '@tee/data'

export interface ProjectEligibilityInterface {
  isEligible(project: ProjectType, codeNAF1: string): boolean
}

export interface ProjectRepository {
  getOneBySlug: (id: string) => ProjectType | undefined
  getOneById: (id: number) => ProjectType | undefined
  get: () => ProjectType[]
}

export interface ProjectSorterInterface {
  byPriority(projects: ProjectType[], codeNAF: string | undefined): ProjectType[]
}
