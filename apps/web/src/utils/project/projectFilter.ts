import { ProgramData, Objective, ThemeType, Project } from '@/types'
import { Theme } from '@/utils/theme'

export default class ProjectFilter {
  static byTheme(project: Project, objectiveType: Objective) {
    const themeSelected: ThemeType | undefined = Theme.getByValue(objectiveType)

    if (themeSelected) {
      return project.themes.includes(themeSelected.id)
    }

    return false
  }
  static byPrograms(project: Project, filteredPrograms: ProgramData[]) {
    return project.programs.some((programId) => filteredPrograms.some(({ id }) => id === programId))
  }
}
