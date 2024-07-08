<template>
  <DsfrAccordion
    v-if="project.longDescription.length > 0"
    id="project-details"
    :expanded-id="expandedId"
    @expand="expandDetails"
  >
    <template #title>
      <div
        id="project-details-title"
        class="fr-h3"
      >
        ❓ Qu'est ce que c'est ?
      </div>
    </template>
    <div v-html="markdownToHtml(project.longDescription)" />
  </DsfrAccordion>

  <DsfrAccordion
    v-if="project.moreDescription.length > 0"
    id="project-more-details"
    :expanded-id="expandedMoreId"
    @expand="expandMoreDetails"
  >
    <template #title>
      <div
        id="project-more-details-title"
        class="fr-h3"
      >
        📚 Pour aller plus loin
      </div>
    </template>
    <div v-html="markdownToHtml(project.moreDescription)" />
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

const expandDetails = (id: string | undefined) => {
  expandedId.value = id
}

const expandMoreDetails = (id: string | undefined) => {
  expandedMoreId.value = id
}

const markdownToHtml = (text: string | undefined) => {
  if (text) {
    return Marked.toHtml(text)
  }
  return ''
}
</script>
