<template>
  <div class="fr-grid-row fr-grid-row--center fr-mt-2v fr-mt-md-3v">
    <div class="fr-pl-md-0 fr-col-3 fr-col-md-12 fr-col-content--middle fr-text--blue-france tee-font-style--italic">
      <TeeCounterResult :to-count="filteredPrograms" />
    </div>
    <div class="fr-col-9 fr-col-hidden-md fr-text-right">
      <ProgramModalFilter />
    </div>
  </div>
  <ul class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-lg--left fr-mt-2v fr-raw-list">
    <li
      v-for="program in filteredPrograms"
      :key="program.id"
      class="fr-col-12 fr-col-sm-6 fr-col-md-12"
    >
      <ProgramCard
        :program="program"
        class="fr-enlarge-link fr-card--horizontal-tier"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import ProgramCard from '@/components/program/list/ProgramCard.vue'
import { type ProgramData } from '@/types'

interface Props {
  filteredPrograms?: ProgramData[]
}
defineProps<Props>()
</script>
