<template>
  <div
    v-if="isCatalogDetail"
    class="fr-grid-row fr-mt-0"
  >
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
import Navigation from '@/tools/navigation'
import Program from '@/tools/program/program'
import Translation from '@/tools/translation'
import { AbstractProgramTypeForFront } from '@tee/data'

const { currentProgram, currentExtProgram } = storeToRefs(useProgramStore())
const { currentProject } = storeToRefs(useProjectStore())
const navigation = new Navigation()

const backLink = Program.getBackLink((currentProgram.value || currentExtProgram.value) as AbstractProgramTypeForFront, currentProject.value)

const isCatalogDetail = navigation.isCatalogProgramDetail()
</script>
