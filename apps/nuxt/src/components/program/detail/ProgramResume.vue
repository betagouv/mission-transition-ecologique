<template>
  <section>
    <!-- PROGRAM RESUME / TEXT-->
    <h2
      class="fr-text--blue-france"
      v-html="currentProgram?.promesse"
    />
    <p
      class="fr-mb-12v fr-text--blue-france"
      v-html="currentProgram?.description"
    />
    <section>
      <ProgramObjective
        v-if="currentProgram"
        :program="currentProgram"
      />
    </section>
    <DsfrButton
      v-if="!isProgramAutonomous && programIsEligible && isDataFull && !Program.isTemporaryUnavailable(currentProgram)"
      size="lg"
      icon="fr-icon-mail-line"
      class="fr-ml-md-3v"
      :on-click="scrollToProgramForm"
    >
      {{ Translation.t('program.CTAButton') }}
    </DsfrButton>
  </section>
</template>
<script setup lang="ts">
import Navigation from '@/tools/navigation'
import Program from '@/tools/program/program'
import { Scroll } from '@/tools/scroll'
import Translation from '@/tools/translation'
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
</script>
