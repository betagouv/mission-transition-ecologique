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
      class="fr-enlarge-link fr-card--horizontal-tier"
    />
  </div>
</template>

<script setup lang="ts">
import { type ProgramType, Project } from '@/types'
import ProgramCard from '@/components/program/list/ProgramCard.vue'

interface Props {
  programs: ProgramType[]
  project: Project
  title: string
}
defineProps<Props>()
</script>
