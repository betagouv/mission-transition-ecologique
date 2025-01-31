import { ProjectType } from '@/types'
import { ComputedRef } from 'vue'

export default class ProjectSorter {
  static readonly sort = (projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> => {
    console.trace('Sort by priority')
    return computed(() => {
      if (!projects.value) {
        return []
      }

      return projects.value.slice().sort((a, b) => {
        return a.priority - b.priority
      })
    })
  }

  static sortBySector(projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> {
    console.trace('Sort by sector')
    return computed(() => {
      if (!projects.value) {
        return []
      }

      return projects.value.slice().sort((a, b) => {
        return a.sectors.length <= 5 && a.sectors.length < b.sectors.length ? -1 : 1

        if (a.sectors.length === b.sectors.length) {
          return a.priority - b.priority
        }
      })
    })
  }
}
