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

// import { ProjectType } from '@/types'
// import { ComputedRef } from 'vue'
//
// export default class ProjectSorter {
//   static readonly sort = (projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> => {
//     console.trace('Sort by priority')
//     return computed(() => {
//       if (!projects.value) {
//         return []
//       }
//
//       return projects.value.slice().sort((a, b) => {
//         return a.priority - b.priority
//       })
//     })
//   }
//
//   static sortBySector(projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> {
//     console.trace('Sort by sector')
//     return computed(() => {
//       if (!projects.value) {
//         return []
//       }
//
//       return projects.value.slice().sort((a, b) => {
//         if (a.sectors.length === b.sectors.length) {
//           return a.priority - b.priority
//         }
//
//         return a.sectors.length <= 5 && a.sectors.length < b.sectors.length ? -1 : 1
//       })
//     })
//   }
// }
