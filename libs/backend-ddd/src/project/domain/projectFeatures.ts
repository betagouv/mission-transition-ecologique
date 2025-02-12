import { QuestionnaireData } from '@tee/common'
import { ProjectEligibility, ProjectType } from '@tee/data'
import { projects } from '@tee/data/static'
import { ProjectEligibilityInterface, ProjectSorterInterface } from './spi'

export default class ProjectFeatures {
  private readonly _projectEligibility: ProjectEligibilityInterface
  private readonly _projectSorter: ProjectSorterInterface

  constructor(projectEligibility: ProjectEligibilityInterface, projectSorter: ProjectSorterInterface) {
    this._projectEligibility = projectEligibility
    this._projectSorter = projectSorter
  }

  public getById(id: number): ProjectType | undefined {
    return projects.find((project) => project.id === +id)
  }

  public getBySlug(slug: string): ProjectType | undefined {
    return projects.find((project) => project.slug === slug)
  }

  public getFiltered(questionnaireData: QuestionnaireData): ProjectType[] {
    this._sort(projects)
    if (!questionnaireData.codeNAF1 || !questionnaireData.onlyEligible) {
      return projects
    }
    return projects.filter((project) => ProjectEligibility.isEligible(project, questionnaireData.codeNAF1 as string))
  }

  public getFiltered(projectQuery: ProjectFilterQuery): ProjectType[] {
  //   if (projectQuery.sortBy === ProjectSortBy.PRIORITY || !projectQuery.sortBy) {
  //     this._sortByPriority(projects)
  //   }
  //
  //   if (!projectQuery.codeNAF1) {
  //     return projects
  //   }
  //
  //   const filteredProjects = projects.filter((project) => {
  //     return projectQuery.onlyEligible === false ? true : this._projectEligibility.isEligible(project, projectQuery.codeNAF1 as string)
  //   })
  //
  //   if (projectQuery.sortBy === ProjectSortBy.SECTOR || !projectQuery.sortBy) {
  //     return this._projectSorter.sortBySector(filteredProjects)
  //   }
  //
  //   return filteredProjects
  // }

  // private _sortByPriority(projects: ProjectType[]) {
  //   projects.sort((a, b) => {
  //     return a.priority - b.priority
  //   })
  // }

  private _sort(projects: ProjectType[]) {
    projects.sort((a, b) => {
      return a.priority - b.priority
    })
  }
}
