import { ProjectType as ProjectType } from '@/types'

export default class ProjectSorter {
  static readonly highlightSort = (projects: ProjectType[]): ProjectType[] => {
    return projects.toSorted((a, b) => {
      if (!a.highlightPriority) {
        return 1
      }
      if (!b.highlightPriority) {
        return -1
      }
      return a.highlightPriority - b.highlightPriority
    })
  }
}
