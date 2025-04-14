import { QuestionnaireData } from '@tee/common'
import { ProjectType } from '@tee/data'
import { ProjectEligibilityInterface, ProjectRepository, ProjectSorterInterface } from './spi'

export default class ProjectFeatures {
  private readonly _projectEligibility: ProjectEligibilityInterface
  private readonly _projectSorter: ProjectSorterInterface

  constructor(
    private readonly _projectRepository: ProjectRepository,
    projectEligibility: ProjectEligibilityInterface,
    projectSorter: ProjectSorterInterface
  ) {
    this._projectEligibility = projectEligibility
    this._projectSorter = projectSorter
  }

  public getById(id: number): ProjectType | undefined {
    return this._projectRepository.getOneById(id)
  }

  public getBySlug(slug: string): ProjectType | undefined {
    return this._projectRepository.getOneBySlug(slug)
  }

  public getFiltered(questionnaireData: QuestionnaireData): ProjectType[] {
    const projects = this._projectRepository.get()
    this._projectSorter.byPriority(projects)
    console.log(questionnaireData.onlyEligible === false)
    if (!questionnaireData.codeNAF1 || questionnaireData.onlyEligible === false) {
      console.log('Return raw projects')
      return projects
    }
    const eligibleProjects = projects.filter((project) => {
      return this._projectEligibility.isEligible(project, questionnaireData.codeNAF1 as string)
    })

    console.log('Return sorted projects')
    return this._projectSorter.bySector(eligibleProjects)
  }
}
