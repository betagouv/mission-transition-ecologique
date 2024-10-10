import { ProgramData, ThemeId, ThemeType, Project } from '@/types'
import { Theme } from '@/tools/theme'

export default class ProjectFilter {
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
