import { ProjectType } from '@/types'
import { ComputedRef } from 'vue'

export default class ProjectSorter {
  static readonly sort = (projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> => {
    return computed(() => {
      if (!projects.value) {
        return []
      }

      const sortByPriority = projects.value.slice().sort((a, b) => {
        return a.priority - b.priority
      })

      return useFiltersStore().isCompanyDataSelected()
        ? sortByPriority
            .toReversed()
            .slice()
            .sort((a, b) => {
              return a.sectors.length <= 5 && a.sectors.length < b.sectors.length ? -1 : 1
            })
        : sortByPriority
    })
  }
}
