import { ProjectType } from './types/shared'

export class ProjectSorter {
  public byPriority(projects: ProjectType[]) {
    console.log('Sort by priority')
    return projects.sort((a, b) => {
      return a.priority - b.priority
    })
  }

  public bySector(projects: ProjectType[]) {
    console.log('Sort by sector')
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
}
