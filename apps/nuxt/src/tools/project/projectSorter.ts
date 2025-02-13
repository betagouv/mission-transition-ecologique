import { ProjectType as ProjectType } from '@/types'

export default class ProjectSorter {
  static readonly highlightSort = (projects: ProjectType[]): ProjectType[] => {
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

  static readonly sortBySector = (projects: ProjectType[]) => {
    return projects.sort((a, b) => {
      return a.sectors.length <= 5 && a.sectors.length < b.sectors.length ? -1 : 1
    })
  }

  static readonly highlightAndSectorSort = (projects: ProjectType[]): ProjectType[] => {
    const sectorProjects = projects.filter((project) => project.sectors.length <= 5).sort((a, b) => a.sectors.length - b.sectors.length)
    const highlightSorted = ProjectSorter.highlightSort(projects.filter((project) => project.sectors.length > 5))

    return [...sectorProjects, ...highlightSorted]
  }
}
