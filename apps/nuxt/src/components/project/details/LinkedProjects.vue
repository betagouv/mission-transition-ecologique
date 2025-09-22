<template>
  <TeeContentBlock
    id="project-linked-projects-title"
    class="fr-py-5v fr-border-b--grey--light"
    :title="project.titleLinkedProjects ?? Translation.t('project.linkedProjects.title')"
    container-from="md"
    title-class="fr-h4 fr-mb-2v"
    title-tag="h2"
  >
    <template #content>
      <div
        class="fr-mb-4v"
        v-html="
          project.descriptionLinkedProjects
            ? Marked.toHtml(project.descriptionLinkedProjects)
            : Translation.t('project.linkedProjects.description')
        "
      />
      <ul class="fr-grid-row fr-grid-row--gutters fr-grid-row--left fr-raw-list">
        <li
          v-for="linkedProject in linkedProjectsTags"
          :key="linkedProject.id"
          class="fr-col-12 fr-col-sm-6 fr-col-lg-4"
        >
          <ProjectCard
            :project="linkedProject"
            :title-tag="h3"
            class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
          />
        </li>
      </ul>
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { Marked } from '@/tools/marked'
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
