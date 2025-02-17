<template>
  <Layout before-default-class="fr-container--fluid fr-container-md">
    <template #beforeDefault>
      <div class="fr-grid-row">
        <div class="fr-container fr-grid-row fr-px-md-0">
          <div
            class="fr-col-12 fr-mt-3v fr-text-center fr-text-left-md"
            :class="lineClassBySideMenu"
          >
            <h1 class="fr-text--blue-france">{{ title }}</h1>
          </div>
        </div>
        <div
          v-if="!hasError"
          class="fr-col-12 fr-mt-3v"
          :class="lineClassBySideMenu"
        >
          <ThemeFilter />
        </div>
      </div>
      <div
        v-if="!hasError"
        class="fr-grid-row"
      >
        <div
          class="fr-col-12"
          :class="lineClassBySideMenu"
        >
          <ThemeHeaderCard
            v-if="hasThemeCard"
            :theme="theme as ThemeId"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </template>
    <template
      v-if="!hasError"
      #sidemenu
    >
      <ProgramFiltersAccordion with-title />
    </template>
    <ProgramList :filtered-programs="filteredPrograms" />
    <div
      v-if="hasSpinner"
      class="fr-col-12 fr-col-justify--center"
    >
      <TeeSpinner class="fr-my-16w" />
    </div>
    <TeeListNoResults
      v-else-if="hasNoResultsOrError"
      :has-error="hasError && !hasSpinner"
      message="Aucune idée d'action n'a pu être identifiée avec les critères choisis..."
      :count-items="countPrograms"
    />
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { useFiltersStore } from '@/stores/filters'
import { useNavigationStore } from '@/stores/navigation'
import { Theme } from '@/tools/theme'
import { RouteName, ThemeId } from '@/types'
import { useProgramStore } from '@/stores/program'
import { ProgramManager } from '@/tools/program/programManager'
import { MetaSeo } from '@/tools/metaSeo'
import { computed } from 'vue'

definePageMeta({
  name: RouteName.CatalogPrograms,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries]
})

const programStore = useProgramStore()
const filtersStore = useFiltersStore()

const { programs, hasError } = storeToRefs(programStore)
const { hasSpinner } = storeToRefs(useNavigationStore())
const theme = Theme.getThemeFromSelectedTheme()

const title = 'Les aides à la transition écologique'
const description =
  'Réalisez une recherche parmi les aides à la transition écologique des entreprises, proposées par l’ensemble des partenaires publics :' +
  'ADEME, Bpifrance, CCI, CMA, etc.'

onServerPrefetch(async () => {
  await new ProgramManager().getDependentCompanyData(false)
})

onNuxtReady(async () => {
  await new ProgramManager().getDependentCompanyData(false)
})

useSeoMeta(MetaSeo.get(title, description))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

const hasSideMenu = computed(() => {
  return hasError.value
})

const lineClassBySideMenu = computed(() => {
  return hasSideMenu.value
    ? ''
    : 'fr-col-offset-md-3 fr-col-md-9 fr-col-justify-md--left fr-col-offset-lg-2 fr-col-lg-10 fr-col-justify--center'
})

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const hasThemeCard = computed(() => {
  return filtersStore.hasThemeTypeSelected()
})

const countPrograms = computed(() => {
  return filteredPrograms.value?.length || 0
})

const hasNoResultsOrError = computed(() => {
  return !hasSpinner.value && (hasError.value || !countPrograms.value)
})
</script>
