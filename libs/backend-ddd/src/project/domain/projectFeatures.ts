import { QuestionnaireData } from '@tee/common'
import { ProjectEligibility, ProjectType } from '@tee/data'
import { projects } from '@tee/data/static'

export default class ProjectFeatures {
  public getById(id: number): ProjectType | undefined {
    return projects.find((project) => project.id === +id)
  }

  public getBySlug(slug: string): ProjectType | undefined {
    return projects.find((project) => project.slug === slug)
  }

  public getFiltered(questionnaireData: QuestionnaireData): ProjectType[] {
    if (!questionnaireData.codeNAF1) {
      return projects
    }
    return projects.filter((project) => ProjectEligibility.isEligible(project, questionnaireData.codeNAF1 as string))
  }
}
