import { ProjectType as ProjectType } from '@/types'
import { ComputedRef } from 'vue'

export default class ProjectSorter {
  static readonly highlightSort = (projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> => {
    return computed(() => {
      if (!projects.value) {
        return []
      }

      return projects.value.slice().sort((a, b) => {
        if (!a.highlightPriority) {
          return 1
        }
        if (!b.highlightPriority) {
          return -1
        }
        return a.highlightPriority - b.highlightPriority
      })
    })
  }
}
