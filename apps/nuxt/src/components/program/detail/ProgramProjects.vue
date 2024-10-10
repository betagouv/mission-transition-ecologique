<template>
  <div class="fr-mt-2v">
    <div class="fr-grid-row fr-grid-row--center fr-grid-row-md--left">
      <template
        v-for="linkedProject in linkedProjects"
        :key="linkedProject.id"
      >
        <TeeProjectButton
          :project="linkedProject"
          target="_blank"
          class="fr-my-1-5v fr-mx-2v"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Project as ProjectType } from '@/types'

interface Props {
  linkedProjects: ProjectType[]
}
defineProps<Props>()
</script>
