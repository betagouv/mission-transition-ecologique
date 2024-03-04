<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container fr-px-0 fr-px-md-4w fr-mt-6v">
    <ProgramListHeaderResult v-if="!navigation.isCatalog()" />
    <div class="fr-grid-row">
      <div class="fr-mt-4v fr-mb-2v fr-col-12">
        <div
          v-if="havePrograms && countPrograms > 1"
          class="tee-text-light"
        >
          {{ countFilteredPrograms }}
          {{ countFilteredPrograms > 1 ? Translation.t('results.results') : Translation.t('results.result') }}
        </div>
      </div>
      <div class="fr-col-12">
        <ProgramFilters v-if="havePrograms && countPrograms > 1" />
      </div>

      <div class="fr-col-12">
        <ProgramListNoResults
          v-if="!countFilteredPrograms"
          image="images/tracks/no-results.svg"
          :message="{ fr: 'Aucune aide n\'a pu être identifiée avec les critères choisis...' }"
        />
      </div>

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
</template>

<script setup lang="ts">
import ProgramCard from '@/components/program/list/ProgramCard.vue'
import ProgramListHeaderResult from '@/components/program/list/ProgramListHeaderResult.vue'
import { computed, onBeforeMount } from 'vue'
import Translation from '@/utils/translation'
import { useProgramStore } from '@/stores/program'
import { type ProgramData, TrackId } from '@/types'
import { useNavigationStore } from '@/stores/navigation'
import { RouteName } from '@/types/routeType'
import Matomo from '@/utils/matomo'
import ProgramListNoResults from '@/components/program/list/ProgramListNoResults.vue'
import ProgramFilters from '@/components/program/list/ProgramFilters.vue'

const programsStore = useProgramStore()
const navigation = useNavigationStore()

const programs: ProgramData[] = programsStore.getProgramsByUsedTracks()

const filteredPrograms = computed(() => {
  return programsStore.getProgramsByFilters(programs)
})

const countPrograms = computed(() => {
  return programs?.length || 0
})

const havePrograms = computed(() => {
  return countPrograms.value > 0
})

const countFilteredPrograms = computed(() => {
  return filteredPrograms.value?.length || 0
})

const getRouteToProgramDetail = (programId: string) => {
  const routeName = navigation.isCatalog() ? RouteName.CatalogDetail : RouteName.QuestionnaireResultDetail
  return { name: routeName, params: { programId } }
}

onBeforeMount(() => {
  // analytics / send event
  Matomo.sendEvent(TrackId.Results, navigation.isCatalog() ? 'show_results_catalog' : 'show_results')
})
</script>
