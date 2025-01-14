import { ProjectFilterQuery } from '@tee/common'
import { ProjectType } from '@tee/data'
import { projects } from '@tee/data/static'

export default class ProjectFeatures {
  public getById(id: number): ProjectType | undefined {
    return projects.find((project) => project.id === +id)
  }

  public getBySlug(slug: string): ProjectType | undefined {
    return projects.find((project) => project.slug === slug)
  }

  public getFiltered(projectQuery: ProjectFilterQuery): ProjectType[] {
    const naf1s: string[] = this._getNaf1FromQueryData(projectQuery)

    if (naf1s.length === 0) {
      return projects
    }

    return projects.filter((project) => naf1s.some((naf1) => project.sectors.includes(naf1)))
  }

  private _getNaf1FromQueryData(projectQuery: ProjectFilterQuery): string[] {
    let codeNAF1s: string[] = []
    if (projectQuery.codeNAF1) {
      codeNAF1s = [projectQuery.codeNAF1]
    }
    return codeNAF1s
  }
}
