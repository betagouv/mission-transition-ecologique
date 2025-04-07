<template>
  <ul>
    <li class="fr-text--purple">
      <h4 class="fr-mb-2v fr-text--purple fr-text--bold fr-text--md">{{ title }}</h4>
      <ul class="fr-raw-list fr-ml-n2w">
        <li
          v-for="program in programs"
          :key="program.id"
          class="fr-col-12 no-outline fr-mb-6v"
        >
          <ProgramCard
            :program="program"
            :project="project"
            class="fr-enlarge-link fr-card--horizontal-tier"
          />
        </li>
      </ul>
    </li>
  </ul>
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
