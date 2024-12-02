// CONSOLE LOG TEMPLATE
// console.log(`store.programs > FUNCTION_NAME > MSG_OR_VALUE :`)

import ProgramApi from '@/tools/api/programApi'
import { useUsedTrackStore } from '@/stores/usedTrack'
import ProgramFilter from '@/tools/program/programFilter'
import { Result } from 'true-myth'
import { computed, ref } from 'vue'
import { type programFiltersType, ProgramAidType, ThemeId, Region, type ProgramData, QuestionnaireData, OperatorFilter } from '@/types'

export const useProgramStore = defineStore('program', () => {
  const currentProgram = ref<ProgramData>()
  const hasPrograms = ref<boolean>(false)

  const programFilters = ref<programFiltersType>({
    programAidTypesSelected: [],
    regionAidSelected: [],
    operatorAidSelected: [],
    themeTypeSelected: ''
  })

  const programs = computed(async () => {
    const result = await getPrograms()

    if (result.isOk()) {
      hasPrograms.value = result.data.length > 0
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
        ProgramFilter.byAidType(program, programFilters.value.programAidTypesSelected as ProgramAidType[]) &&
        ProgramFilter.byTheme(program, programFilters.value.themeTypeSelected as ThemeId) &&
        ProgramFilter.byOperator(program, programFilters.value.operatorAidSelected as OperatorFilter[]) &&
        ProgramFilter.byRegion(program, programFilters.value.regionAidSelected as Region[])
      )
    })
  }

  async function getProgramById(id: string): Promise<Result<ProgramData, Error>> {
    currentProgram.value = undefined

    // if (hasPrograms.value) {
    //   const result = await programs.value
    //   if (result.isOk) {
    //     const program = result.data.find((program) => program.id === id)
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
    if (result.isOk()) {
      currentProgram.value = result.data
      return Result.ok(result.data)
    }

    return Result.err(new Error(result.error?.message))
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
    programsByUsedTracks,
    getProgramsByFilters,
    getPrograms,
    getProgramById,
    hasThemeTypeSelected,
    setThemeTypeSelected,
    getThemeTypeSelected,
    resetFilters
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramStore, import.meta.hot))
}
