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
import { Faq } from '@/tools/faq'
import { ProjectType } from '@/types'
import { useSchemaOrg } from '@unhead/schema-org/vue'

interface Props {
  project: ProjectType
}
const props = defineProps<Props>()

useSchemaOrg([{ '@type': 'FAQPage', mainEntity: defineQuestions() }])

function defineQuestions() {
  return Faq.getDefineQuestions(props.project.faqs)
}
</script>
