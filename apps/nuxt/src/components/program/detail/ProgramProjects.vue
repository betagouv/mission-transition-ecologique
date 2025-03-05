<template>
  <ul class="fr-grid-row fr-grid-row--center fr-grid-row-md--left fr-raw-list">
    <li
      v-for="(linkedProject, index) in linkedProjects"
      :key="linkedProject.id"
      :class="index === 0 ? `fr-mr-2v` : index === linkedProjects.length - 1 ? `fr-ml-2v` : `fr-mx-2v`"
    >
      <TeeProjectButton
        :project="linkedProject"
        target="_blank"
        class="fr-mb-1-5v"
      />
    </li>
  </ul>
</template>
<script lang="ts" setup>
import type { ProjectType as ProjectType } from '@/types'

interface Props {
  linkedProjects: ProjectType[]
}
defineProps<Props>()
</script>
