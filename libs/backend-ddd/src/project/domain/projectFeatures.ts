import { QuestionnaireData } from '@tee/common'
import { ProjectType } from '@tee/data'
import { ProjectEligibilityInterface, ProjectRepository, ProjectSorterInterface } from './spi'

export default class ProjectFeatures {
  constructor(
    private readonly _projectRepository: ProjectRepository,
    private readonly _projectEligibility: ProjectEligibilityInterface,
    private readonly _projectSorter: ProjectSorterInterface
  ) {}

  public getById(id: number): ProjectType | undefined {
    return this._projectRepository.getOneById(id)
  }

  public getBySlug(slug: string): ProjectType | undefined {
    return this._projectRepository.getOneBySlug(slug)
  }

  public getFiltered(questionnaireData: QuestionnaireData): ProjectType[] {
    const projects = this._projectRepository.get()
    this._projectSorter.byPriority(projects, questionnaireData.codeNAF)
    if (!questionnaireData.codeNAF1 || questionnaireData.onlyEligible === false) {
      return projects
    }
    return projects.filter((project) => {
      return this._projectEligibility.isEligible(project, questionnaireData.codeNAF1 as string)
    })
  }
}
