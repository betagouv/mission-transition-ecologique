// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import ProgramFilter from '@/tools/program/programFilter'
import { ref } from 'vue'
import { type programFiltersType, ProgramAidType, ThemeId, Region, type ProgramData, OperatorFilter } from '@/types'

export const useProgramStore = defineStore('program', () => {
  const currentProgram = ref<ProgramData>()
  const programs = ref<ProgramData[]>([])
  const hasPrograms = ref<boolean>(false)
  const hasError = ref<boolean>(false)

  const programFilters = ref<programFiltersType>({
    programAidTypesSelected: [],
    regionAidSelected: [],
    operatorAidSelected: [],
    themeTypeSelected: ''
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
        ProgramFilter.byAidType(program, programFilters.value.programAidTypesSelected as ProgramAidType[]) &&
        ProgramFilter.byTheme(program, programFilters.value.themeTypeSelected as ThemeId) &&
        ProgramFilter.byOperator(program, programFilters.value.operatorAidSelected as OperatorFilter[]) &&
        ProgramFilter.byRegion(program, programFilters.value.regionAidSelected as Region[])
      )
    })
  }

  function hasThemeTypeSelected() {
    return programFilters.value.themeTypeSelected !== ''
  }

  function setThemeTypeSelected(themeType: string) {
    programFilters.value.themeTypeSelected = themeType
  }

  function getThemeTypeSelected() {
    return programFilters.value.themeTypeSelected
  }

  function resetFilters() {
    programFilters.value = {
      programAidTypesSelected: [],
      themeTypeSelected: '',
      regionAidSelected: [],
      operatorAidSelected: []
    }
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
    reset
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramStore, import.meta.hot))
}
