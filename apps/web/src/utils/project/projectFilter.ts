import { ProgramType, ThemeId, ThemeType, Project } from '@/types'
import { Theme } from '@/utils/theme'

export default class ProjectFilter {
  static byTheme(project: Project, themeId: ThemeId) {
    const themeSelected: ThemeType | undefined = Theme.getById(themeId)

    if (themeSelected) {
      return project.themes.includes(themeSelected.id)
    }

    return false
  }
  static byPrograms(project: Project, filteredPrograms: ProgramType[]) {
    return project.programs.some((programId) => filteredPrograms.some(({ id }) => id === programId))
  }
}
