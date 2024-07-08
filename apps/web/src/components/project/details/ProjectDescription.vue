<template>
  <DsfrAccordion
    v-if="project.longDescription.length > 0"
    id="project-details"
    :expanded-id="expandedId"
    @expand="(id: string | undefined) => (expandedId = id)"
  >
    <template #title>
      <div
        id="project-details-title"
        class="fr-h3"
      >
        ❓ Qu'est ce que c'est ?
      </div>
    </template>
    <div
      class="fr-mx-4v"
      v-html="markdownToHtml(project.longDescription)"
    />
  </DsfrAccordion>

  <DsfrAccordion
    v-if="project.moreDescription.length > 0"
    id="project-more-details"
    :expanded-id="expandedMoreId"
    @expand="(id: string | undefined) => (expandedMoreId = id)"
  >
    <template #title>
      <div
        id="project-more-details-title"
        class="fr-h3"
      >
        📚 Pour aller plus loin
      </div>
    </template>
    <div
      class="fr-mx-4v"
      v-html="markdownToHtml(project.moreDescription)"
    />
  </DsfrAccordion>
</template>
<script setup lang="ts">
import { Project } from '@/types'
import { Marked } from '@/utils/marked'

interface Props {
  project: Project
}
defineProps<Props>()
const expandedId = ref<string | undefined>('project-details')
const expandedMoreId = ref<string | undefined>('project-more-details')

const markdownToHtml = (text: string | undefined) => {
  if (text) {
    return Marked.toHtml(text)
  }
  return ''
}
</script>
