<template>
  <TeeContentBlock
    v-for="(faq, index) in project.faqs"
    id="project-faq-projects-title"
    :key="index"
    class="fr-py-5v fr-border-b--grey--light"
    :title="faq.title ?? 'Questions fréquentes'"
    container-from="md"
    title-class="fr-h4"
    title-tag="h2"
  >
    <template #content>
      <FaqQuestions
        :faq-questions="faq.questions"
        is-full-width
      />
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { ProjectManager } from '@/tools/project/projectManager'
import { ProjectType } from '@/types'

interface Props {
  project: ProjectType
}
defineProps<Props>()

const linkedProjectsTags = ref<ProjectType[]>([])

onNuxtReady(async () => {
  await new ProjectManager().getProjects()
  linkedProjectsTags.value = await useProjectStore().getLinkedProjectsFromCurrent()
})
</script>
