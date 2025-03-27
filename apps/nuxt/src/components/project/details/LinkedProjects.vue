<template>
  <TeeContentBlock
    id="project-linked-projects-title"
    class="fr-pt-3v fr-pb-4v fr-border-b--grey--light"
    :title="Translation.t('project.linkedProjects.title')"
    container-from="md"
  >
    <template #content>
      <div class="fr-my-4v">{{ Translation.t('project.linkedProjects.description') }}</div>
      <ul class="fr-grid-row fr-grid-row--left fr-raw-list">
        <li
          v-for="(linkedProject, index) in linkedProjectsTags"
          :key="linkedProject.id"
          :class="index === 0 ? `fr-mr-1v` : index === linkedProjectsTags.length - 1 ? `fr-ml-1v` : `fr-mx-1v`"
        >
          <TeeProjectButton
            class="fr-my-1-5v"
            target="_blank"
            :project="linkedProject"
            :color="color"
          />
        </li>
      </ul>
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
