<template>
  <div class="fr-grid-row fr-mt-0">
    <div class="fr-col-12">
      <TeeButtonLink
        v-if="backLink"
        icon="fr-icon-arrow-left-line"
        size="lg"
        class="fr-btn fr-btn--tertiary-no-outline fr-pl-2v"
        :to="backLink"
        >{{ Translation.t('results.back') }}</TeeButtonLink
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import Translation from '@/tools/translation'
import { RouteName } from '@/types'

const { currentExtProgram: currentExternalProgram } = storeToRefs(useProgramStore())

const backLink = {
  name: RouteName.CatalogPrograms,
  hash: currentExternalProgram.value ? '#' + currentExternalProgram.value.id : '',
  query: undefined
}
</script>
