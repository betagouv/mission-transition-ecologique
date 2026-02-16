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
import AbstractProgram from '@/tools/program/abstractProgram'
import Translation from '@/tools/translation'

const { currentProject } = storeToRefs(useProjectStore())
const navigation = new Navigation()

const backLink = AbstractProgram.getBackLink(AbstractProgram.getCurrent().value, currentProject.value)

const isCatalogDetail = navigation.isCatalogProgramDetail()
</script>
