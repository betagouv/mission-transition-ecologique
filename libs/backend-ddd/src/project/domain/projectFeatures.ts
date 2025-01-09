import { ProjectFilterQuery, Sector } from '@tee/common'
import { ProjectType } from '@tee/data'
import { projects } from '@tee/data/static'
import { SectorToNAFSection } from '../../common/naf1'

export default class ProjectFeatures {
  public getById(id: number): ProjectType | undefined {
    return projects.find((project) => project.id === +id)
  }

  public getBySlug(slug: string): ProjectType | undefined {
    return projects.find((project) => project.slug === slug)
  }

  public getFiltered(projectQuery: ProjectFilterQuery): ProjectType[] {
    const sectors: string[] = this._getSectorsFromQueryData(projectQuery)

    if (sectors.length === 0) {
      return projects
    }

    return projects.filter((project) => sectors.some((sector) => project.sectors.includes(sector)))
  }

  private _getSectorsFromQueryData(projectQuery: ProjectFilterQuery): string[] {
    let codeNAF1s: string[] = []
    if (projectQuery.codeNAF1) {
      codeNAF1s = [projectQuery.codeNAF1]
    } else if (projectQuery.sector) {
      codeNAF1s = SectorToNAFSection[projectQuery.sector as Sector]
    }
    return codeNAF1s
  }
}
