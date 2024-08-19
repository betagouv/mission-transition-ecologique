<template>
  <DsfrAccordion
    v-if="linkedProjectsTags.length > 0"
    id="project-linked-projects"
    :expanded-id="expandedId"
    @expand="(id: string | undefined) => (expandedId = id)"
  >
    <template #title>
      <div
        id="project-linked-projects-title"
        class="fr-h3"
      >
        Projets complémentaires
      </div>
    </template>

    <div class="fr-grid-row fr-grid-row--center fr-grid-row-md--left">
      <template
        v-for="linkedProject in linkedProjectsTags"
        :key="linkedProject.id"
      >
        <TeeProjectButton
          class="fr-my-1-5v fr-mx-2v"
          :project="linkedProject"
          :color="color"
        />
      </template>
    </div>
  </DsfrAccordion>
</template>
<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { Color, Project } from '@/types'

interface Props {
  project: Project
  color?: Color
}
defineProps<Props>()

const expandedId = ref<string | undefined>('project-linked-projects')
const linkedProjectsTags = ref<Project[]>([])

onMounted(async () => {
  linkedProjectsTags.value = await useProjectStore().getLinkedProjectsFromCurrent()
})
</script>
