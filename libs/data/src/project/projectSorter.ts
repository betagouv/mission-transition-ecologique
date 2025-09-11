import { NafRepository } from '../establishment/nafRepository'
import { ProjectType } from './types/shared'

export class ProjectSorter {
  public byPriority(projects: ProjectType[], codeNAF: string | undefined) {
    return projects.sort((a, b) => {
      return this._getPriority(a.priority, codeNAF) - this._getPriority(b.priority, codeNAF)
    })
  }

  public bySector(projects: ProjectType[]) {
    return projects.sort((a, b) => {
      return a.sectors.length <= 5 && a.sectors.length < b.sectors.length ? -1 : 1
    })
  }

  public byHighlight(projects: ProjectType[]): ProjectType[] {
    return projects.slice().sort((a, b) => {
      if (!a.highlightPriority) {
        return 1
      }
      if (!b.highlightPriority) {
        return -1
      }
      return a.highlightPriority - b.highlightPriority
    })
  }

  public byHighlightAndSector(projects: ProjectType[]): ProjectType[] {
    const sectorProjects = projects.filter((project) => project.sectors.length <= 5).sort((a, b) => a.sectors.length - b.sectors.length)
    const highlightSorted = this.byHighlight(projects.filter((project) => project.sectors.length > 5))

    return [...sectorProjects, ...highlightSorted]
  }

  private _getPriority(priorities: Record<string, number>, companySector: string | undefined): number {
    if (!companySector) {
      return priorities['default']
    }
    if (priorities[companySector]) {
      return priorities[companySector]
    }

    const nafRepository = new NafRepository()
    for (const getter of ['getNiv4', 'getNiv3', 'getNiv2', 'getSectionCode'] as const) {
      const code = nafRepository[getter](companySector)
      if (code.isJust && priorities[code.value]) {
        return priorities[code.value]
      }
    }

    return priorities['default']
  }
}
