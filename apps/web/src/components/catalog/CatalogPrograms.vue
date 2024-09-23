<template>
  <Layout>
    <template #top>
      <CatalogBanner>
        <template #title> Le catalogue des aides publiques à la transition écologique </template>
        <template #description>
          Réalisez une recherche parmi les aides à la transition écologique des entreprises, proposées par l’ensemble des partenaires
          publics : ADEME, Bpifrance, CCI, CMA, etc.
        </template>
      </CatalogBanner>
    </template>
    <div
      v-if="hasSpinner || hasError"
      class="fr-grid-row fr-grid-row--center"
    >
      <TeeSpinner
        v-if="hasSpinner"
        scale="6"
      />
      <ResultListNoResults
        v-else-if="showNoResultsComponent"
        :has-error="hasError"
        :count-items="countPrograms"
      />
    </div>
    <template #beforeDefault>
      <div class="fr-grid-row fr-grid-row--center fr-m-0 fr-p-0">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-col-justify--left fr-mt-3v">
          <ThemeFilter v-if="hasThemeFilter" />
        </div>
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-pr-md-2v">
          <ThemeHeaderCard
            v-if="showThemeCard"
            :theme="theme as ThemeId"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </template>
    <template
      v-if="!hasSpinner"
      #sidemenu
    >
      <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
      <ProgramFiltersAccordion />
    </template>
    <ProgramList :filtered-programs="filteredPrograms" />
  </Layout>

  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-6v"></div>
</template>

<script setup lang="ts">
import Layout from '@/layout/Layout.vue'
import { useProgramStore } from '@/stores/program'
import { type ProgramData, TrackId, ThemeId } from '@/types'
import Matomo from '@/utils/matomo'
import UsedTrack from '@/utils/track/usedTrack'
import { computed, onBeforeMount } from 'vue'

const programStore = useProgramStore()

const programs = ref<ProgramData[]>()
const hasError = ref<boolean>(false)

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const countPrograms = computed(() => {
  return programs.value?.length || 0
})

const havePrograms = computed(() => {
  return countPrograms.value > 0
})

const hasSpinner = computed(() => {
  return programs.value === undefined && !hasError.value
})

const hasThemeCard = computed(() => {
  return programStore.hasThemeTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme())
})

const theme = computed(() => {
  if (programStore.hasThemeTypeSelected()) {
    return programStore.programFilters.themeTypeSelected
  }

  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme()) {
    return UsedTrack.getPriorityTheme()
  }

  return ''
})

const showNoResultsComponent = computed(() => {
  return hasSpinner.value || hasError.value || !countPrograms.value
})

const hasThemeFilter = computed(() => {
  return havePrograms.value && countPrograms.value > 1
})

const showThemeCard = computed(() => {
  return hasThemeCard.value && !hasSpinner.value
})

onBeforeMount(async () => {
  const result = await programStore.programs
  if (result.isOk) {
    programs.value = result.value
  } else {
    hasError.value = true
  }

  // analytics / send event
  Matomo.sendEvent(TrackId.Results, 'show_results_catalog')
})
</script>
