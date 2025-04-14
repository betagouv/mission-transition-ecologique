// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import { CompanyData } from '@/tools/companyData'
import ProgramFilter from '@/tools/program/programFilter'
import { ref } from 'vue'
import { ProgramAidType, ThemeId, Region, OperatorFilter, FilterItemKeys, ProgramTypeForFront } from '@/types'

export const useProgramStore = defineStore('program', () => {
  const currentProgram = ref<ProgramTypeForFront>()
  const programs = ref<ProgramTypeForFront[]>([])
  const hasPrograms = ref<boolean>(false)
  const hasError = ref<boolean>(false)

  const filtersStore = useFiltersStore()

  function reset() {
    programs.value = []
    currentProgram.value = undefined
    hasPrograms.value = false
    hasError.value = false
  }

  function getProgramsByFilters(programs: ProgramTypeForFront[]) {
    const isCompanySelected = CompanyData.isCompanySelected()
    if (isCompanySelected) {
      useFiltersStore().resetFilter(FilterItemKeys.regionAid)
    }
    return programs.filter((program: ProgramTypeForFront) => {
      return (
        ProgramFilter.byAidType(program, filtersStore.filters[FilterItemKeys.typeAid] as ProgramAidType[]) &&
        ProgramFilter.byTheme(program, filtersStore.filters[FilterItemKeys.themeType] as ThemeId) &&
        ProgramFilter.byOperator(program, filtersStore.filters[FilterItemKeys.operatorAid] as OperatorFilter[]) &&
        ProgramFilter.byRegion(program, filtersStore.regions as Region[]) &&
        ProgramFilter.byCompanyData(program, isCompanySelected)
      )
    })
  }

  return {
    programs,
    currentProgram,
    hasPrograms,
    hasError,
    getProgramsByFilters,
    reset
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramStore, import.meta.hot))
}
