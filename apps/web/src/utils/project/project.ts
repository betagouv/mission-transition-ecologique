import { useProjectStore } from '@/stores/project'
import { ThemeId, ProgramData, Project as ProjectType } from '@/types'
import { ComputedRef, Ref } from 'vue'

export class Project {
  static readonly filter = (
    projects: Ref<ProjectType[] | undefined>,
    programs: Ref<ProgramData[] | undefined>,
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
}
