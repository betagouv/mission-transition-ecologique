<template>
  <LayoutList>
    <template #counter>
      <TeeCounterResult :in-count="programNumber" />
    </template>
    <template #modalFilter>
      <ProgramModalFilter />
    </template>
    <li
      v-for="program in sortedPrograms"
      :id="program.id"
      :key="program.id"
      class="fr-col-12 fr-col-sm-6 fr-col-md-12"
    >
      <ProgramCard
        :program="program"
        class="fr-enlarge-link fr-card--horizontal-tier"
      />
    </li>
    <li
      v-for="externalProgram in extFilteredPrograms"
      :id="externalProgram.id"
      :key="externalProgram.id"
      class="fr-col-12 fr-col-sm-6 fr-col-md-12"
    >
      <ExternalProgramCard
        :program="externalProgram"
        class="fr-enlarge-link fr-card--horizontal-tier"
      />
    </li>
  </LayoutList>
</template>

<script setup lang="ts">
import ProgramCard from '@/components/program/list/ProgramCard.vue'
import ExternalProgramCard from '@/components/program/externalProgram/ExternalProgramCard.vue'
import { AbstractProgramTypeForFront, ProgramTypeForFront } from '@/types'
import { ProgramSorter } from '@/tools/program/programSorter'

interface Props {
  filteredPrograms?: ProgramTypeForFront[]
  extFilteredPrograms?: AbstractProgramTypeForFront[]
}
const props = defineProps<Props>()
const sortedPrograms = computed(() => ProgramSorter.byAlphabeticalOrder(props.filteredPrograms ?? []))
const programNumber = computed(() => {
  return (props.filteredPrograms?.length || 0) + (props.extFilteredPrograms?.length || 0)
})
</script>
