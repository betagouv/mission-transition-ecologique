import { useProjectStore } from '@/stores/project'
import { ProgramData, ThemeId, ThemeType, Project, Project as ProjectType } from '@/types'
import { Theme } from '@/tools/theme'
import { ComputedRef, Ref } from 'vue'

export default class ProjectFilter {
  static readonly filter = (projects: Ref<ProjectType[] | undefined>, theme: ComputedRef<ThemeId | undefined>) => {
    return computed(() => {
      if (!projects.value) {
        return undefined
      }

      return useProjectStore().getProjectsByTheme(projects.value, theme.value ?? undefined)
    })
  }

  static byTheme(project: Project, themeId: ThemeId) {
    const themeSelected: ThemeType | undefined = Theme.getById(themeId)

    if (themeSelected) {
      return project.themes.includes(themeSelected.id)
    }

    return false
  }
  static byPrograms(project: Project, filteredPrograms: ProgramData[]) {
    return project.programs.some((programId) => filteredPrograms.some(({ id }) => id === programId))
  }
}
