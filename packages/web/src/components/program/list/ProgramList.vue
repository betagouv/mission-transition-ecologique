<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container fr-px-0 fr-mt-6v">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div
        v-if="havePrograms && countPrograms > 1"
        class="fr-mb-4v tee-text-light"
      >
        {{ countFilteredPrograms }}
        {{ Translation.t('results.results') }}
      </div>

      <ProgramListHeaderResult v-if="!navigation.isCatalog" />

      <ProgramFilters v-if="havePrograms && countPrograms > 1" />

      <TeeNoResults
        v-if="!countFilteredPrograms"
        image="images/tracks/no-results.svg"
        :message="{ fr: 'Aucune aide n\'a pu être identifiée avec les critères choisis...' }"
      />

      <component
        :is="navigation.isCatalog ? 'router-link' : 'div'"
        v-for="program in filteredPrograms"
        :id="program.id"
        :key="program.id"
        :to="navigation.isCatalog ? { name: RouteName.CatalogDetail, params: { programId: program.id } } : undefined"
        class="fr-card fr-enlarge-link fr-card--horizontal-tier fr-mb-10v"
        @click="updateDetailResult(program.id)"
      >
        <ProgramCard :program="program" />
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramCard from '@/components/program/list/ProgramCard.vue'
import ProgramListHeaderResult from '@/components/program/list/ProgramListHeaderResult.vue'
import { computed, onBeforeMount } from 'vue'
import Translation from '@/utils/translation'
import { useProgramsStore } from '@/stores/programs'
import { type ProgramData, TrackId } from '@/types'
import { navigationStore } from '@/stores/navigation'
import { RouteName } from '@/types/routeType'
import Widget from '@/utils/widget'
import Matomo from '@/utils/matomo'
import TeeNoResults from '@/components/results/TeeNoResults.vue'
import ProgramFilters from '@/components/program/list/ProgramFilters.vue'

const programsStore = useProgramsStore()
const navigation = navigationStore()

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

const updateDetailResult = async (id: string | number) => {
  if (Widget.is) {
    programsStore.setDetailResult(id, TrackId.Results)
    return
  }
  if (navigation.isCatalog) {
    return
  }
  // Set detail infos
  programsStore.setDetailResult(id, TrackId.Results)
  await navigation.setCurrentDetailId(id)
  // scrollToTop(props.trackElement)
}

onBeforeMount(() => {
  // analytics / send event
  Matomo.sendEvent(TrackId.Results, navigation.isCatalog ? 'show_results_catalog' : 'show_results')
})
</script>
