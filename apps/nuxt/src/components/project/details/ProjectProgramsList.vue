<template>
  <li class="fr-text--purple">
    <h3 class="fr-mb-2v fr-text--purple fr-text--bold fr-text--md">{{ title }}</h3>
    <ul class="fr-raw-list fr-ml-n2w fr-grid-row fr-grid-row--gutters">
      <li
        v-for="program in programs"
        :key="program.id"
        class="fr-col-12 fr-col-sm-6 fr-col-md-12 fr-pl-0"
      >
        <ProgramCard
          :program="program"
          :project="project"
          class="fr-enlarge-link fr-card--horizontal-tier"
          title-tag="h4"
        />
      </li>
    </ul>
  </li>
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
