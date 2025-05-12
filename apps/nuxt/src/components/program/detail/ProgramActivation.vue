<template>
  <ProgramObjective
    v-if="currentProgram"
    :program="currentProgram"
    :form-container-ref="props.formContainerRef"
    :scroll-to-form="scrollToProgramForm"
    :is-cta-to-form-visible="isCTAToFormVisible"
  />
</template>

<script setup lang="ts">
import Navigation from '@/tools/navigation'
import Program from '@/tools/program/program'
import { Scroll } from '@/tools/scroll'
import { ProgramEligibility, ProgramType, RouteName } from '@/types'

const { currentProgram } = storeToRefs(useProgramStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())
const navigation = new Navigation()

interface Props {
  formContainerRef: HTMLElement | null | undefined
}
const props = defineProps<Props>()

const scrollToProgramForm = () => {
  if (props.formContainerRef) {
    navigation.isByRouteName(RouteName.CatalogProgramDetail) || navigation.isByRouteName(RouteName.CatalogProgramFromCatalogProjectDetail)
      ? Scroll.to(props.formContainerRef)
      : Scroll.toWithTopBarOffset(props.formContainerRef)
  }
}

const programIsEligible = computed(() => {
  return currentProgram.value ? ProgramEligibility.isEligible(currentProgram.value as unknown as ProgramType) : false
})

const isProgramAutonomous = computed(() => {
  return Program.isProgramAutonomous(currentProgram.value)
})

const isCTAToFormVisible = computed(() => {
  return !isProgramAutonomous.value && programIsEligible.value && isDataFull.value && !Program.isTemporaryUnavailable(currentProgram.value)
})
</script>
