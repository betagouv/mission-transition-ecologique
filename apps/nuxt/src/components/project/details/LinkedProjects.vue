<template>
  <TeeContentBlock
    id="project-linked-projects-title"
    class="fr-pt-3v fr-pb-4v fr-border-b--grey--light"
    :title="Translation.t('project.linkedProjects.title')"
  >
    <template #content>
      <div class="fr-my-4v">{{ Translation.t('project.linkedProjects.description') }}</div>
      <div class="fr-grid-row fr-grid-row--left">
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
import { ProjectManager } from '@/tools/project/projectManager'
import { Color, ProjectType } from '@/types'
import Translation from '@/tools/translation'

interface Props {
  project: ProjectType
  color?: Color
}
defineProps<Props>()

const linkedProjectsTags = ref<ProjectType[]>([])

onNuxtReady(async () => {
  await new ProjectManager().getProjects()
  linkedProjectsTags.value = await useProjectStore().getLinkedProjectsFromCurrent()
})
</script>
