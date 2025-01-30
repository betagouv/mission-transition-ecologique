import { ProjectType } from '@/types'
import { ComputedRef } from 'vue'

export default class ProjectSorter {
  static readonly sort = (projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> => {
    console.trace('Sort by priority')
    return computed(() => {
      if (!projects.value) {
        return []
      }

      return this.sortByPriority(projects.value)
    })
  }

  static sortBySector(projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> {
    console.trace('Sort by sector')
    return computed(() => {
      if (!projects.value) {
        return []
      }

      const sortedProjects = this.sortByPriority(projects.value)

      return sortedProjects
        .toReversed()
        .slice()
        .sort((a, b) => {
          return a.sectors.length <= 5 && a.sectors.length < b.sectors.length ? -1 : 1
        })
    })
  }

  private static sortByPriority(projects: ProjectType[]): ProjectType[] {
    return projects.slice().sort((a, b) => {
      return a.priority - b.priority
    })
  }
}
