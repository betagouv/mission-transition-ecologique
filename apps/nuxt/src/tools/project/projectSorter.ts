import type { ProjectType } from '@/types'
export default class ProjectSorter {
  static readonly byHighlight = (projects: ProjectType[] | undefined): ProjectType[] => {
    if (!projects) {
      return []
    }

    // Using slice->sort instead of toSorted to ensure maximum browser compatibilities
    return projects.slice().sort((a, b) => {
      if (!a.highlightPriority && b.highlightPriority) {
        return 1
      }
      if (!b.highlightPriority && a.highlightPriority) {
        return -1
      }
      if (a.highlightPriority && b.highlightPriority) {
        return a.highlightPriority - b.highlightPriority
      }
      return 0
    })
  }
}
