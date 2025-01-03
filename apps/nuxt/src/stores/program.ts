// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import ProgramFilter from '@/tools/program/programFilter'
import { ref } from 'vue'
import { type ProgramFiltersType, ProgramAidType, ThemeId, Region, type ProgramData, OperatorFilter, FilterItemKeys } from '@/types'

export const useProgramStore = defineStore('program', () => {
  const currentProgram = ref<ProgramData>()
  const programs = ref<ProgramData[]>([])
  const hasPrograms = ref<boolean>(false)
  const hasError = ref<boolean>(false)

  const programFilters = ref<ProgramFiltersType>({
    [FilterItemKeys.typeAid]: [],
    [FilterItemKeys.themeType]: '',
    [FilterItemKeys.regionAid]: [],
    [FilterItemKeys.operatorAid]: [],
    [FilterItemKeys.companyData]: false
  })

  function reset() {
    programs.value = []
    currentProgram.value = undefined
    hasPrograms.value = false
    hasError.value = false
  }

  function getProgramsByFilters(programs: ProgramData[]) {
    return programs.filter((program: ProgramData) => {
      return (
        ProgramFilter.byAidType(program, programFilters.value[FilterItemKeys.typeAid] as ProgramAidType[]) &&
        ProgramFilter.byTheme(program, programFilters.value[FilterItemKeys.themeType] as ThemeId) &&
        ProgramFilter.byOperator(program, programFilters.value[FilterItemKeys.operatorAid] as OperatorFilter[]) &&
        ProgramFilter.byRegion(program, programFilters.value[FilterItemKeys.regionAid] as Region[]) &&
        ProgramFilter.byCompanyData(program, programFilters.value[FilterItemKeys.companyData])
      )
    })
  }

  function hasThemeTypeSelected() {
    return programFilters.value[FilterItemKeys.themeType] !== ''
  }

  function setThemeTypeSelected(themeType: string) {
    programFilters.value[FilterItemKeys.themeType] = themeType
  }

  function getThemeTypeSelected() {
    return programFilters.value[FilterItemKeys.themeType]
  }

  function resetFilters() {
    programFilters.value = {
      [FilterItemKeys.typeAid]: [],
      [FilterItemKeys.themeType]: '',
      [FilterItemKeys.regionAid]: [],
      [FilterItemKeys.operatorAid]: [],
      [FilterItemKeys.companyData]: false
    }
  }

  function resetFilter(filterKey: FilterItemKeys) {
    if (filterKey === FilterItemKeys.themeType) {
      programFilters.value[filterKey] = ''
      return
    } else if (filterKey === FilterItemKeys.companyData) {
      programFilters.value[filterKey] = false
      return
    }
    programFilters.value[filterKey] = []
  }

  return {
    programs,
    currentProgram,
    programFilters,
    hasPrograms,
    hasError,
    getProgramsByFilters,
    hasThemeTypeSelected,
    setThemeTypeSelected,
    getThemeTypeSelected,
    resetFilters,
    resetFilter,
    reset
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramStore, import.meta.hot))
}
