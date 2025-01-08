// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import ProgramApi from '@/service/api/programApi'
import { useUsedTrackStore } from '@/stores/usedTrack'
import ProgramFilter from '@/utils/program/programFilter'
import { Result } from 'true-myth'
import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import {
  FilterItemKeys,
  OperatorFilter,
  ProgramAidType,
  type ProgramData,
  type ProgramFiltersType,
  QuestionnaireData,
  Region,
  ThemeId
} from '@/types'

export const useProgramStore = defineStore('program', () => {
  const currentProgram = ref<ProgramData>()
  const hasPrograms = ref<boolean>(false)

  const programFilters = ref<ProgramFiltersType>({
    [FilterItemKeys.typeAid]: [],
    [FilterItemKeys.themeType]: '',
    [FilterItemKeys.regionAid]: [],
    [FilterItemKeys.operatorAid]: [],
    [FilterItemKeys.companyData]: false
  })

  const programs = computed(async () => {
    const result = await getPrograms()

    if (result.isOk) {
      hasPrograms.value = result.value.length > 0
    }

    return result
  })

  const programsByUsedTracks = computed(async () => {
    // filter out programs
    return await getPrograms(useUsedTrackStore().getQuestionnaireData())
  })

  async function getPrograms(questionnaireData: QuestionnaireData = {}) {
    return await new ProgramApi(questionnaireData).get()
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

  async function getProgramById(id: string): Promise<Result<ProgramData, Error>> {
    currentProgram.value = undefined

    // if (hasPrograms.value) {
    //   const result = await programs.value
    //   if (result.isOk) {
    //     const program = result.value.find((program) => program.id === id)
    //     if (program) {
    //       currentProgram.value = program
    //       return Result.ok(currentProgram.value)
    //     }
    //
    //     return Result.err(new Error('Program not found'))
    //   }
    //
    //   return Result.err(result.error)
    // }

    const result = await new ProgramApi(useUsedTrackStore().getQuestionnaireData()).getOne(id)
    if (result.isOk) {
      currentProgram.value = result.value
    }

    return result
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
    programsByUsedTracks,
    getProgramsByFilters,
    getProgramById,
    hasThemeTypeSelected,
    setThemeTypeSelected,
    getThemeTypeSelected,
    resetFilters,
    resetFilter
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramStore, import.meta.hot))
}
