import { useProjectStore } from '@/stores/project'
import { ThemeId, Project as ProjectType } from '@/types'
import { ComputedRef, Ref } from 'vue'

export class Project {
  static readonly filter = (projects: Ref<Project[] | undefined>, theme: ComputedRef<ThemeId | undefined>) => {
    return computed(() => {
      if (!projects.value) {
        return undefined
      }

      return useProjectStore().getProjectsByTheme(projects.value, theme.value ?? undefined)
    })
  }

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
