import { ProgramData, ThemeId, ThemeType, ProjectType } from '@/types'
import { Theme } from '@/tools/theme'
import { ComputedRef, Ref } from 'vue'

export default class ProjectFilter {
  static readonly filter = (projects: Ref<ProjectType[] | undefined>, theme: ComputedRef<ThemeId | undefined>) => {
    return computed(() => {
      if (!projects.value) {
        return undefined
      }

      return this.getProjectsByTheme(projects.value, theme.value ?? undefined)
    })
  }

  static getProjectsByTheme(projects: ProjectType[], themeType?: ThemeId): ProjectType[] {
    return projects.filter((project: ProjectType) => {
      return themeType
        ? this.byTheme(project, themeType)
        : project.themes.some((themeId) => Theme.getTags().some(({ id }) => id === themeId))
    })
  }

  static byTheme(project: ProjectType, themeId: ThemeId) {
    const themeSelected: ThemeType | undefined = Theme.getById(themeId)

    if (themeSelected) {
      return project.themes.includes(themeSelected.id)
    }

    return false
  }
  static byPrograms(project: ProjectType, filteredPrograms: ProgramData[]) {
    return project.programs.some((programId) => filteredPrograms.some(({ id }) => id === programId))
  }
}
