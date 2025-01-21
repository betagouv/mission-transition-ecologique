import { ProgramData, ThemeId, ThemeType, ProjectType, EstablishmentFront, FilterItemKeys, type ValueOf, FiltersType } from '@/types'
import { Theme } from '@/tools/theme'
import { ComputedRef, Ref } from 'vue'
import { CompanyData } from '@/tools/companyData'
import { useFiltersStore } from '@/stores/filters'

export default class ProjectFilter {
  static readonly filter = (projects: Ref<ProjectType[] | undefined>, theme: ComputedRef<ThemeId | undefined>) => {
    return computed(() => {
      if (!projects.value) {
        return undefined
      }

      const results = this.getProjectsByTheme(projects.value, theme.value ?? undefined)

      return results.filter((project: ProjectType) => {
        return this.byCompanyData(project, useFiltersStore().filters[FilterItemKeys.companyData])
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
    if (!this.isValidFilterValue(companySelected)) {
      return true
    }

    if (companySelected) {
      return project.sectors.includes((CompanyData.company as EstablishmentFront)?.codeNAF1)
    }
    return true
  }

  static byPrograms(project: ProjectType, filteredPrograms: ProgramData[]) {
    return project.programs.some((programId) => filteredPrograms.some(({ id }) => id === programId))
  }

  static isValidFilterValue(programFilterValue: ValueOf<FiltersType> | undefined) {
    return programFilterValue !== undefined && programFilterValue !== ''
  }
}
