<template>
  <ul class="fr-ml-3v">
    <li class="fr-mb-2v fr-text--purple fr-text--bold">{{ title }}</li>
  </ul>

  <div
    v-for="program in programs"
    :key="program.id"
    class="fr-col-12 no-outline fr-mb-6v"
  >
    <ProgramCard
      :program="program"
      :project="project"
      class="fr-enlarge-link fr-card--horizontal-tier"
    />
  </div>
</template>

<script setup lang="ts">
import { ProgramTypeForFront, ProjectType } from '@/types'
import ProgramCard from '@/components/program/list/ProgramCard.vue'

interface Props {
  programs: ProgramTypeForFront[]
  project: ProjectType
  title: string
}
defineProps<Props>()
</script>
