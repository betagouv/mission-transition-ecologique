<template>
  <TeeRegisterHighlight
    v-if="!isDataFull"
    :text="Translation.t('program.programRegisterHighlightText')"
  />
  <!-- <div v-if="isDataFull && programIsEligible">
    <DsfrButton
      size="lg"
      icon="fr-icon-mail-line"
      class="fr-ml-md-3v"
      :on-click="() => scrollToProgramRef(activationRef)"
    >
      {{ Translation.t('program.CTAButton') }}
    </DsfrButton>
    <DsfrButton
      secondary
      size="lg"
      icon="fr-icon-mail-line"
      class="fr-ml-md-3v"
      :on-click="() => scrollToProgramRef(activationRef)"
    >
      TODO Bouton de question
    </DsfrButton>
  </div> -->
</template>

<script lang="ts">
// import { useProgramStore } from '@/stores/program'
// import { storeToRefs } from 'pinia'
// import { ProgramEligibility, ProgramType } from '@/types'

// interface Props {
//   formContainerRef: HTMLElement | null | undefined
//   activationRef: HTMLElement | null | undefined
// }
// const props = defineProps<Props>()

// const { currentProgram } = storeToRefs(useProgramStore())
// const { isDataFull } = storeToRefs(useCompanyDataStore())

// const programIsEligible = computed(() => {
//   return currentProgram.value ? ProgramEligibility.isEligible(currentProgram.value as unknown as ProgramType) : false
// })

// const scrollToProgramRef = (reference) => {
//   if (reference) {
//     navigation.isByRouteName(RouteName.CatalogProgramDetail) || navigation.isByRouteName(RouteName.CatalogProgramFromCatalogProjectDetail)
//       ? Scroll.to(reference)
//       : Scroll.toWithTopBarOffset(reference)
//   }
// }
</script>
