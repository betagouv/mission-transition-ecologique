// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import { useCompanyDataStore } from '@/stores/companyData'
import { useFiltersStore } from '@/stores/filters'
import ProgramFilter from '@/tools/program/programFilter'
import { AbstractProgramTypeForFront, FilterItemKeys, OperatorFilter, ProgramAidType, ProgramTypeForFront, Region, ThemeId } from '@/types'
import { ref } from 'vue'

export const useProgramStore = defineStore('program', () => {
  const currentProgram = ref<ProgramTypeForFront>()
  const programs = ref<ProgramTypeForFront[]>([])
  const hasPrograms = ref<boolean>(false)
  const hasError = ref<boolean>(false)
  const currentExtProgram = ref<AbstractProgramTypeForFront>()
  const extPrograms = ref<AbstractProgramTypeForFront[]>([])

  const filtersStore = useFiltersStore()
  const companyStore = useCompanyDataStore()

  function reset() {
    programs.value = []
    currentProgram.value = undefined
    hasPrograms.value = false
    hasError.value = false
    currentExtProgram.value = undefined
    extPrograms.value = []
  }

  const programsByFilters = computed(() => {
    const isCompanySelected = filtersStore.companyDataSelected && companyStore.isDataFull
    if (isCompanySelected) {
      filtersStore.resetFilter(FilterItemKeys.regionAid)
    }

    return programs.value.filter((program: ProgramTypeForFront) => {
      return (
        ProgramFilter.byAidType(program, filtersStore.filters[FilterItemKeys.typeAid] as ProgramAidType[]) &&
        ProgramFilter.byTheme(program, filtersStore.filters[FilterItemKeys.themeType] as ThemeId) &&
        ProgramFilter.byOperator(program, filtersStore.filters[FilterItemKeys.operatorAid] as OperatorFilter[]) &&
        ProgramFilter.byRegion(program, filtersStore.filters[FilterItemKeys.regionAid] as Region[]) &&
        ProgramFilter.byCompanyData(program, isCompanySelected)
      )
    })
  })

  return {
    programs,
    currentProgram,
    hasPrograms,
    hasError,
    programsByFilters,
    currentExtProgram,
    extPrograms,
    reset
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramStore, import.meta.hot))
}
