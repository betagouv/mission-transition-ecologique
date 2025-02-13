<template>
  <CatalogLayout
    :title="title"
    :description="description"
    :has-error="hasError"
    :count-items="countPrograms"
    :has-side-bar="true"
  >
    <template #catalog-content>
      <div class="fr-col-2 fr-col-hidden fr-col-unhidden-lg">
        <div class="fr-sidemenu fr-pr-0 fr-mx-3v">
          <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
          <ProgramFiltersAccordion />
        </div>
      </div>
      <div
        class="fr-col-12 fr-col-justify--center fr-pr-md-2v"
        :class="{
          'fr-col-md-10': !hasError,
          'fr-col-md-12': hasError,
          'fr-hidden': hasError || countPrograms === 0
        }"
      >
        <ProgramList :filtered-programs="filteredPrograms" />
      </div>
    </template>
  </CatalogLayout>
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { ProgramManager } from '@/tools/program/programManager'
import { MetaSeo } from '@/tools/metaSeo'
import { computed } from 'vue'

const programStore = useProgramStore()

const { programs, hasError } = storeToRefs(programStore)

onServerPrefetch(async () => {
  await new ProgramManager().getDependentCompanyData(false)
})

onNuxtReady(async () => {
  await new ProgramManager().getDependentCompanyData(false)
})

const title = 'Les aides à la transition écologique'
const description =
  'Réalisez une recherche parmi les aides à la transition écologique des entreprises, proposées par l’ensemble des partenaires publics :' +
  'ADEME, Bpifrance, CCI, CMA, etc.'

useSeoMeta(MetaSeo.get(title, description))

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const countPrograms = computed(() => {
  return filteredPrograms.value?.length || 0
})

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})
</script>
