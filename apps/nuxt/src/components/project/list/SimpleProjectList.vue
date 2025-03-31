<template>
  <div class="fr-col-12 fr-mt-2v">
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-sm--left">
      <div
        v-for="project in projectList"
        :key="project.id"
        class="fr-col-12 fr-col-sm-6 fr-col-lg-4"
      >
        <ProjectCard
          :project="project"
          class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
        />
      </div>
      <div
        v-if="filters[FilterItemKeys.themeType] === ''"
        class="fr-col-12 fr-col-sm-6 fr-col-lg-4 no-outline"
      >
        <TeeHomeQuestionnaireCta />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ProjectType } from '@tee/data'
import { FilterItemKeys } from '@/types'

const { filters } = storeToRefs(useFiltersStore())

interface Props {
  projectList?: ProjectType[]
  limit?: number
}

defineProps<Props>()
</script>
