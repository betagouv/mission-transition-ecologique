import { QuestionnaireData } from '@tee/common'
import { ProjectType } from '@tee/data'
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
    this._projectSorter.sortByPriority(projects)
    if (!questionnaireData.codeNAF1 || questionnaireData.onlyEligible === false) {
      console.log('Return raw projects')
      return projects
    }
    const eligibleProjects = projects.filter((project) => {
      return this._projectEligibility.isEligible(project, questionnaireData.codeNAF1 as string)
    })

    console.log('Return sorted projects')
    return this._projectSorter.sortBySector(eligibleProjects)
  }
}
