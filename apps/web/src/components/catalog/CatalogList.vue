<template>
  <!-- PAGE BANNER -->
  <TeeBanner
    class="fr-pt-4v fr-py-md-6w fr-text-center"
    :bg-color="Color.blueLight"
  >
    <template #title>
      <div class="fr-col-10 fr-col-lg-8">
        <h1 class="fr-text--blue-france">L'annuaire des aides publiques à la transition écologique</h1>
      </div>
    </template>
    <template #description>
      <div class="fr-col-12 fr-col-lg-10 fr-col-xl-9 fr-px-1v">
        <p class="fr-text--md">
          Réalisez une recherche parmi les aides à la transition écologique des entreprises, proposées par l’ensemble des partenaires
          publics : ADEME, Bpifrance, CCI, CMA, etc.
        </p>
      </div>
    </template>
  </TeeBanner>

  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-6v">
    <div class="fr-grid-row fr-grid-row--center">
      <TeeSpinner
        v-if="hasSpinner"
        scale="6"
      />
      <ResultListNoResults
        v-else-if="showNoResultsComponent"
        :has-error="hasError"
        :has-spinner="hasSpinner"
        :count-items="countPrograms"
      />
    </div>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-col-justify--left fr-my-3v">
          <ProgramFilterByTheme v-if="showThemeFilterComponent" />
        </div>
      </div>
    </div>
    <div
      v-if="showObjectiveCardComponent"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-m-0 fr-p-0 fr-px-md-2v fr-mt-3v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
          <TeeObjectiveCard
            :objective="objective as Objective"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
        <div class="fr-grid-row fr-grid-row--center">
          <div
            v-if="!hasSpinner"
            class="fr-col-2 fr-col-hidden fr-col-unhidden-md"
          >
            <div class="fr-sidemenu fr-pr-0 fr-mx-3v">
              <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
              <ProgramFiltersAccordion />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-10 fr-pr-md-2v">
            <ProgramList :filtered-programs="filteredPrograms" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramFiltersAccordion from '@/components/program/list/filters/ProgramFiltersAccordion.vue'
import ProgramFilterByTheme from '@/components/program/list/filters/ProgramFilterByTheme.vue'
import { useProgramStore } from '@/stores/program'
import { Color, Objective, type ProgramData, TrackId } from '@/types'
import Matomo from '@/utils/matomo'
import { Theme } from '@/utils/theme'
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

const hasObjectiveCard = computed(() => {
  return programStore.hasObjectiveTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective())
})

const objective = computed(() => {
  if (programStore.hasObjectiveTypeSelected()) {
    return programStore.programFilters.objectiveTypeSelected
  }

  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective()) {
    return Theme.getPublicodeObjectiveByObjective(UsedTrack.getPriorityObjective())
  }

  return ''
})

const showNoResultsComponent = computed(() => {
  return hasSpinner.value || hasError.value || !countPrograms.value
})

const showThemeFilterComponent = computed(() => {
  return havePrograms.value && countPrograms.value > 1
})

const showObjectiveCardComponent = computed(() => {
  return hasObjectiveCard.value && !hasSpinner.value
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
