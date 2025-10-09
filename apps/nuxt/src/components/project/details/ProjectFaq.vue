<template>
  <TeeContentBlock
    id="project-faq-projects-title"
    class="fr-py-5v fr-border-b--grey--light"
    :title="project.titleFaq ?? 'Questions fréquentes'"
    container-from="md"
    title-class="fr-h4"
    title-tag="h2"
  >
    <template #content>
      <FaqQuestions
        :faq-questions="project.faqs"
        is-full-width
      />
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import FaqQuestions from '@/components/faq/FaqQuestions.vue'
import { useProjectStore } from '@/stores/project'
import { Faq } from '@/tools/faq'
import { ProjectManager } from '@/tools/project/projectManager'
import { ProjectType } from '@/types'

interface Props {
  project: ProjectType
}
const props = defineProps<Props>()

const linkedProjectsTags = ref<ProjectType[]>([])

onNuxtReady(async () => {
  await new ProjectManager().getProjects()
  linkedProjectsTags.value = await useProjectStore().getLinkedProjectsFromCurrent()
})

useSchemaOrg([{ '@type': 'FAQPage', mainEntity: defineQuestions() }])

function defineQuestions() {
  return Faq.getDefineQuestions(props.project.faqs)
}
</script>
