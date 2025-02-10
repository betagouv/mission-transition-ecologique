// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import ProgramFilter from '@/tools/program/programFilter'
import { ref } from 'vue'
import { ProgramAidType, ThemeId, Region, type ProgramData, OperatorFilter, FilterItemKeys } from '@/types'

export const useProgramStore = defineStore('program', () => {
  const currentProgram = ref<ProgramData>()
  const programs = ref<ProgramData[]>([])
  const hasPrograms = ref<boolean>(false)
  const hasError = ref<boolean>(false)

  const filtersStore = useFiltersStore()

  function reset() {
    programs.value = []
    currentProgram.value = undefined
    hasPrograms.value = false
    hasError.value = false
  }

  function getProgramsByFilters(programs: ProgramData[]) {
    return programs.filter((program: ProgramData) => {
      return (
        ProgramFilter.byAidType(program, filtersStore.filters[FilterItemKeys.typeAid] as ProgramAidType[]) &&
        ProgramFilter.byTheme(program, filtersStore.filters[FilterItemKeys.themeType] as ThemeId) &&
        ProgramFilter.byOperator(program, filtersStore.filters[FilterItemKeys.operatorAid] as OperatorFilter[]) &&
        ProgramFilter.byRegion(program, filtersStore.filters[FilterItemKeys.regionAid] as Region[]) &&
        ProgramFilter.byCompanyData(program, filtersStore.getCompanyDataSelected().value)
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
