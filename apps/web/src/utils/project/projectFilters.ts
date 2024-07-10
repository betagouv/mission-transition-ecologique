import { ProgramData, PublicodeObjective, ThemeType, Project } from '@/types'
import { Theme } from '@/utils/theme'

export default class ProjectFilters {
  static filterProjectsByTheme(project: Project, objectiveType: PublicodeObjective) {
    const themeSelected: ThemeType | undefined = Theme.getByValue(objectiveType)

    if (themeSelected) {
      return project.themes.includes(themeSelected.id)
    }

    return false
  }
  static filterProjectsByEligibility(project: Project, filteredPrograms: ProgramData[]) {
    return project.programs.some((programId) => filteredPrograms.some(({ id }) => id === programId))
  }
}
