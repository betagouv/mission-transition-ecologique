import { ThemeId, ThemeType, ProjectType, EstablishmentFront, type ValueOf, FiltersType, ProjectEligibility } from '@/types'
import { Theme } from '@/tools/theme'
import { ComputedRef, Ref } from 'vue'
import { CompanyData } from '@/tools/companyData'

export default class ProjectFilter {
  static readonly filter = (projects: Ref<ProjectType[] | undefined>, theme: ComputedRef<ThemeId | undefined>) => {
    return computed(() => {
      if (!projects.value) {
        return undefined
      }
      let results = projects.value
      const companySelected = CompanyData.isCompanySelected()

      if (theme.value) {
        results = this.getProjectsByTheme(projects.value, theme.value)
      }

      return results.filter((project: ProjectType) => {
        return this.byCompanyData(project, companySelected)
      })
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
    if (!this.isValidFilterValue(themeSelected)) {
      return true
    }

    if (themeSelected) {
      return project.themes.includes(themeSelected.id)
    }

    return true
  }

  static byCompanyData(project: ProjectType, companySelected: boolean) {
    if (companySelected) {
      return ProjectEligibility.isEligible(project, (CompanyData.company as EstablishmentFront)?.codeNAF1)
    }
    return true
  }

  static isValidFilterValue(programFilterValue: ValueOf<FiltersType> | undefined) {
    return programFilterValue !== undefined && programFilterValue !== ''
  }
}
