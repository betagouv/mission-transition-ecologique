<template>
  <TeeDsfrBreadcrumb v-if="!hasSpinner" />
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-6v">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div
          class="fr-col-12 fr-mt-3v"
          :class="{
            'fr-col-offset-md-1 fr-col-offset-lg-2 fr-col-md-10 fr-col-justify--left': !hasError,
            'fr-col-lg-12 fr-col-justify--center': hasError
          }"
        >
          <h1 class="fr-text--blue-france">{{ title }}</h1>
        </div>
        <div
          class="fr-col-12 fr-mt-3v"
          :class="{
            'fr-col-offset-md-2 fr-col-md-10 fr-col-justify--left': !hasError,
            'fr-col-md-12 fr-col-justify--center': hasError
          }"
        >
          <h1 class="fr-text--blue-france">{{ title }}</h1>
        </div>
        <div
          class="fr-col-12 fr-mt-3v"
          :class="{
            'fr-col-offset-md-2 fr-col-md-10 fr-col-justify--left': !hasError,
            'fr-col-md-12 fr-col-justify--center': hasError
          }"
        >
          <ThemeFilter />
        </div>
        <div
          class="fr-col-12 fr-pr-md-2v"
          :class="{
            'fr-col-offset-md-1 fr-col-offset-lg-2 fr-col-md-10': !hasError,
            'fr-col-lg-12': hasError
          }"
        >
          <ThemeHeaderCard
            v-if="showThemeCard"
            :theme="theme as ThemeId"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div
          :class="{
            'fr-grid-row': !hasError,
            'fr-grid-row--center': !hasError
          }"
        >
          <div
            v-if="!hasSpinner && !hasError"
            class="fr-col-2 fr-col-hidden fr-col-unhidden-lg"
          >
            <div class="fr-sidemenu fr-pr-0 fr-mx-3v">
              <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
              <ProgramFiltersAccordion />
            </div>
          </div>
          <div
            class="fr-col-12 fr-pr-md-2v fr-col-justify--center"
            :class="{
              'fr-col-md-10': !hasError,
              'fr-col-md-12': hasError
            }"
          >
            <ProgramList
              v-if="!hasError"
              :filtered-programs="filteredPrograms"
            />
            <TeeSpinner
              v-if="hasSpinner"
              class="fr-mt-16w"
            />
            <TeeListNoResults
              v-else-if="showNoResultsComponent"
              :has-error="hasError"
              message="Aucune aide n'a pu être identifiée sur cette thématique..."
              :count-items="countPrograms"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { ProgramManager } from '@/tools/program/programManager'
import { FilterItemKeys, ThemeId } from '@/types'
import { MetaSeo } from '@/tools/metaSeo'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'

const programStore = useProgramStore()

const { hasSpinner } = storeToRefs(useNavigationStore())
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

const hasThemeCard = computed(() => {
  return programStore.hasThemeTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme())
})

const theme = computed(() => {
  if (programStore.hasThemeTypeSelected()) {
    return programStore.programFilters[FilterItemKeys.themeType]
  }

  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme()) {
    return UsedTrack.getPriorityTheme()
  }

  return ''
})

const showNoResultsComponent = computed(() => {
  return hasSpinner.value || hasError.value || !countPrograms.value
})

const showThemeCard = computed(() => {
  return hasThemeCard.value && !hasSpinner.value
})

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})
</script>
