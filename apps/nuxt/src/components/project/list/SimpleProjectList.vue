<template>
  <div class="fr-col-12 fr-mt-2v">
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-lg--left project-cards-container">
      <div
        v-for="project in projectList"
        :key="project.id"
        class="fr-col-12 fr-col-sm-6 fr-col-lg-4 no-outline"
      >
        <ProjectCard
          :project="project"
          class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ProjectType } from '@tee/data'

interface Props {
  projectList?: ProjectType[]
  limit?: number
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.project-cards-container {
  padding: 0.2rem;
}
</style>
