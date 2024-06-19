<template>
  <!-- PAGE BANNER -->
  <TeeBanner
    v-if="isCatalog"
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
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0 fr-mb-0 fr-mt-6v fr-px-md-4w">
    <div class="fr-grid-row fr-grid-row--center fr-justify-center">
      <div
        v-if="!hasSpinner || !hasError"
        class="fr-col-9 fr-col-hidden-md fr-text-right fr-col-xs-12"
      >
        <ProgramModalFilter />
      </div>
      <div class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-col-xs-12">
        <ResultHeader v-if="!navigationStore.isCatalog() && !hasSpinner" />
      </div>
      <div class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-my-2w fr-col-xs-12 fr-pl-3v">
        <ProgramFilterByTheme v-if="havePrograms && countPrograms > 1" />
      </div>
      <div
        v-if="hasObjectiveCard && !hasSpinner"
        class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-col-xs-12 fr-mt-1w"
      >
        <TeeObjectiveCard
          :objective="objective as PublicodeObjective"
          radius-corner="tr"
          radius-size="2-5v"
        />
      </div>
      <div
        v-if="!hasSpinner"
        class="fr-col-2 fr-col-md-3 fr-col-lg-2 fr-col-hidden fr-col-unhidden-md"
      >
        <div class="fr-sidemenu fr-pr-0 fr-mr-3v">
          <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
          <ProgramFiltersAccordion />
        </div>
      </div>
      <div class="fr-col-9 fr-col-xs-12">
        <ProgramList :filtered-programs="filteredPrograms" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramFiltersAccordion from '@/components/program/list/filters/ProgramFiltersAccordion.vue'
import ProgramFilterByTheme from '@/components/program/list/filters/ProgramFilterByTheme.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { Color, type ProgramData, PublicodeObjective, TrackId } from '@/types'
import Matomo from '@/utils/matomo'
import Theme from '@/utils/theme'
import UsedTrack from '@/utils/track/usedTrack'
import { computed, onBeforeMount } from 'vue'

const programStore = useProgramStore()
const navigationStore = useNavigationStore()

const isCatalog = navigationStore.isCatalog()
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

onBeforeMount(async () => {
  const result = useUsedTrackStore().hasUsedTracks() ? await programStore.programsByUsedTracks : await programStore.programs
  if (result.isOk) {
    programs.value = result.value
  } else {
    hasError.value = true
  }

  // analytics / send event
  Matomo.sendEvent(TrackId.Results, navigationStore.isCatalog() ? 'show_results_catalog' : 'show_results')
})
</script>
