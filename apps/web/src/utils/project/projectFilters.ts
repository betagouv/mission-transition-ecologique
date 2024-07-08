import { ProgramData, PublicodeObjective, ThemeType } from '@/types'
import { Project } from '@tee/data'
import Theme from '@/utils/theme'

export default class ProjectFilters {
  static filterProjectsByTheme(project: Project, objectiveType: PublicodeObjective) {
    const themeSelected: ThemeType | undefined = Theme.getByValue(objectiveType)

    if (themeSelected) {
      return project.themes.includes(themeSelected.id)
    }

    return true
  }
  static filterProjectsByEligibility(project: Project, filteredPrograms: ProgramData[]) {
    return project.programs.some((programId) => filteredPrograms.some(({ id }) => id === programId))
  }
}
