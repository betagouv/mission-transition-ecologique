import { useProjectStore } from '@/stores/project'
import { ThemeId, ProgramType, Project as ProjectType } from '@/types'
import { ComputedRef, Ref } from 'vue'

export class Project {
  static readonly filter = (
    projects: Ref<ProjectType[] | undefined>,
    programs: Ref<ProgramType[] | undefined>,
    theme: ComputedRef<ThemeId | ''>
  ) => {
    return computed(() => {
      if (!projects.value) {
        return undefined
      }

      return useProjectStore().getProjectsByThemeAndEligibility(
        projects.value,
        theme.value !== '' ? theme.value : undefined,
        programs.value ?? undefined
      )
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
