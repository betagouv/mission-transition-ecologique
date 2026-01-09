import { ExternalProgramType } from '@/types'
import { ref } from 'vue'

export const useExternalProgramStore = defineStore('externalProgram', () => {
  const currentExternalProgram = ref<ExternalProgramType>()
  const externalPrograms = ref<ExternalProgramType[]>([])
  const hasExternalPrograms = ref<boolean>(false)
  const hasError = ref<boolean>(false)

  function reset() {
    externalPrograms.value = []
    currentExternalProgram.value = undefined
    hasExternalPrograms.value = false
    hasError.value = false
  }

  return {
    externalPrograms,
    currentExternalProgram,
    hasExternalPrograms,
    hasError,
    reset
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExternalProgramStore, import.meta.hot))
}
