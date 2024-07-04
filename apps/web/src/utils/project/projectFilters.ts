import { PublicodeObjective, ThemeType, Project } from '@/types'
import { Theme } from '@/utils/theme'

export default class ProjectFilters {
  static filterProgramsByTheme(project: Project, objectiveType: PublicodeObjective) {
    const themeSelected: ThemeType | undefined = Theme.getByValue(objectiveType)

    if (themeSelected) {
      return project.themes.includes(themeSelected.id)
    }

    return true
  }
}
