import { ProjectFilterQuery, Sector } from '@tee/common'
import { Project } from '@tee/data'
import { projects } from '@tee/data/static'
import { SectorToNAFSection } from '../../program/infrastructure/types'

export default class ProjectFeatures {
  public getById(id: number): Project | undefined {
    return projects.find((project) => project.id === +id)
  }

  public getBySlug(slug: string): Project | undefined {
    return projects.find((project) => project.slug === slug)
  }

  public getFiltered(projectQuery: ProjectFilterQuery): Project[] {
    const sectors: string[] = this._getSectorsFromQueryData(projectQuery)

    return projects.filter((project) => sectors.some((sector) => project.sectors.includes(sector)))
  }

  private _getSectorsFromQueryData(projectQuery: ProjectFilterQuery): string[] {
    let codeNAF1s: string[] = []
    if (projectQuery.codeNAF1) {
      codeNAF1s = [projectQuery.codeNAF1]
    } else {
      codeNAF1s = SectorToNAFSection[projectQuery.sector as Sector]
    }
    return codeNAF1s
  }
}
