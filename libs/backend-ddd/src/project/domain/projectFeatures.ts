import { ProjectFilterQuery } from '@tee/common'
import { ProjectEligibility, ProjectType } from '@tee/data'
import { projects } from '@tee/data/static'

export default class ProjectFeatures {
  public getById(id: number): ProjectType | undefined {
    return projects.find((project) => project.id === +id)
  }

  public getBySlug(slug: string): ProjectType | undefined {
    return projects.find((project) => project.slug === slug)
  }

  public getFiltered(projectQuery: ProjectFilterQuery): ProjectType[] {
    if (!projectQuery.codeNAF1) {
      return projects
    }
    const filteredProjects = projects.filter((project) => ProjectEligibility.isEligible(project, projectQuery.codeNAF1 as string))
    return filteredProjects.sort((a, b) => {
      return a.priority - b.priority
    })
  }
}
