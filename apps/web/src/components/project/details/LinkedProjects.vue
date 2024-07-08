<template>
  <DsfrAccordion
    v-if="linkedProjectsTags.length > 0"
    id="project-linked-projects"
    :expanded-id="expandedId"
    @expand="expandRelatedProjects"
  >
    <template #title>
      <div
        id="project-linked-projects-title"
        class="fr-h3"
      >
        Projets complémentaires
      </div>
    </template>
    <template
      v-for="linkedProject in linkedProjectsTags"
      :key="linkedProject.id"
    >
      <LinkedProjectButton
        v-if="linkedProject"
        :id="linkedProject.id"
        :label="linkedProject.nameTag || linkedProject.title"
        :color="color"
      />
    </template>
  </DsfrAccordion>
</template>
<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { Project } from '@/types'

interface Props {
  project: Project
  color: string
}
defineProps<Props>()

const expandedId = ref<string | undefined>('project-linked-projects')
const linkedProjectsTags = ref<Project[]>([])

const expandRelatedProjects = (id: string | undefined) => {
  expandedId.value = id
}

onMounted(async () => {
  linkedProjectsTags.value = await useProjectStore().getLinkedProjectsFromCurrent()
})
</script>
