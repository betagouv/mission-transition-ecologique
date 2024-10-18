<template>
  <TeeContentBlock
    id="project-linked-projects-title"
    class="fr-pt-3v fr-pb-4v fr-border-b--grey--light"
    title="Projets complémentaires"
  >
    <template #content>
      <div class="fr-grid-row fr-grid-row--center fr-grid-row-md--left">
        <template
          v-for="linkedProject in linkedProjectsTags"
          :key="linkedProject.id"
        >
          <TeeProjectButton
            class="fr-my-1-5v fr-mx-2v"
            target="_blank"
            :project="linkedProject"
            :color="color"
          />
        </template>
      </div>
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { Color, Project } from '@/types'

interface Props {
  project: Project
  color?: Color
}
defineProps<Props>()

const linkedProjectsTags = ref<Project[]>([])

onMounted(async () => {
  linkedProjectsTags.value = await useProjectStore().getLinkedProjectsFromCurrent()
})
</script>
