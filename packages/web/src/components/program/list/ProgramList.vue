<template>
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
        <ProgramListHeaderResult v-if="!navigationStore.isCatalog() && !hasSpinner" />
      </div>
      <div class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-mb-3v fr-col-xs-12">
        <ProgramFilterByTheme v-if="havePrograms && countPrograms > 1" />
      </div>
      <div
        v-if="hasObjectiveCard && !hasSpinner"
        class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-col-xs-12"
      >
        <TeeObjectiveCard
          :objective="objective as PublicodeObjective"
          radius-corner="tr"
          radius-size="2-5v"
        />
      </div>
      <div class="fr-mt-4v fr-pl-2w fr-pl-md-0 fr-mb-2v fr-col-9 fr-col-offset-sm-3 fr-col-offset-lg-2 fr-col-xs-12">
        <div v-if="havePrograms && countPrograms > 1">
          {{ countFilteredPrograms }}
          {{ countFilteredPrograms > 1 ? Translation.t('results.results') : Translation.t('results.result') }}
        </div>
      </div>
      <div
        v-if="!hasSpinner"
        class="fr-col-2 fr-col-md-3 fr-col-lg-2 fr-col-hidden fr-col-unhidden-md"
      >
        <div class="fr-sidemenu fr-pr-0 fr-mr-3v">
          <div class="fr-text--bold fr-text-left fr-mb-3v">Filtres</div>
          <ProgramFiltersAccordion />
        </div>
      </div>
      <div
        v-if="hasSpinner || hasError || !countFilteredPrograms"
        class="fr-col-9 fr-text-center"
      >
        <TeeSpinner
          v-if="hasSpinner"
          scale="6"
        />
        <ProgramListNoResults
          v-else-if="!countFilteredPrograms && !hasError"
          image="images/tracks/no-results.svg"
          :message="{ fr: 'Aucune aide n\'a pu être identifiée avec les critères choisis...' }"
        />
        <TeeError
          v-else-if="hasError"
          :mailto="Contact.email"
          :email="Contact.email"
        />
      </div>
      <div class="fr-col-9 fr-col-xs-12">
        <div class="fr-container--fluid fr-container--fluid--no-overflow">
          <div class="fr-grid-row fr-grid-row--center">
            <router-link
              v-for="program in filteredPrograms"
              :id="program.id"
              :key="program.id"
              :to="getRouteToProgramDetail(program.id)"
              class="fr-col-12 fr-card fr-enlarge-link fr-card--horizontal-tier fr-mb-10v"
            >
              <ProgramCard :program="program" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramFiltersAccordion from '@/components/program/list/filters/ProgramFiltersAccordion.vue'
import ProgramCard from '@/components/program/list/ProgramCard.vue'
import ProgramFilterByTheme from '@/components/program/list/filters/ProgramFilterByTheme.vue'
import ProgramListHeaderResult from '@/components/program/list/ProgramListHeaderResult.vue'
import Contact from '@/utils/contact'
import ProgramListNoResults from '@/components/program/list/ProgramListNoResults.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { type ProgramData, PublicodeObjective, TrackId } from '@/types'
import { RouteName } from '@/types/routeType'
import Matomo from '@/utils/matomo'
import Objective from '@/utils/objective'
import UsedTrack from '@/utils/track/usedTrack'
import Translation from '@/utils/translation'
import { computed, onBeforeMount } from 'vue'
import { type RouteLocationRaw } from 'vue-router'

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

const countFilteredPrograms = computed(() => {
  return filteredPrograms.value?.length || 0
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
    return Objective.getPublicodeObjectiveByObjective(UsedTrack.getPriorityObjective())
  }

  return ''
})

const getRouteToProgramDetail = (programId: string): RouteLocationRaw => {
  return {
    name: isCatalog ? RouteName.CatalogDetail : RouteName.QuestionnaireResultDetail,
    params: { programId },
    query: isCatalog ? undefined : navigationStore.query
  }
}

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
