import { ProjectType as ProjectType } from '@/types'
import { ComputedRef } from 'vue'

export default class ProjectSorter {
  static readonly sort = (projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> => {
    return computed(() => {
      if (!projects.value) {
        return []
      }

      return projects.value.slice().sort((a, b) => {
        return a.priority - b.priority
      })
    })
  }
}
