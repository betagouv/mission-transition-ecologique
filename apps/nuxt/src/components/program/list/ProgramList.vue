<template>
  <LayoutList>
    <template #counter>
      <TeeCounterResult :to-count="filteredPrograms" />
    </template>
    <template #modalFilter>
      <ProgramModalFilter />
    </template>
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
  </LayoutList>
</template>

<script setup lang="ts">
import ProgramCard from '@/components/program/list/ProgramCard.vue'
import { type ProgramData } from '@/types'

interface Props {
  filteredPrograms?: ProgramData[]
}
defineProps<Props>()
</script>
