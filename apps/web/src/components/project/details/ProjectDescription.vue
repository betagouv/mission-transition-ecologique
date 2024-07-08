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
    <div v-html="formatProjectDescription(project.longDescription)" />
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
    <div v-html="formatProjectDescription(project.moreDescription)" />
  </DsfrAccordion>
</template>
<script setup lang="ts">
import { Project } from '@/types'
import { marked } from 'marked'

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

const formatProjectDescription = (text: string | undefined) => {
  if (text) {
    return marked.parse(text)
  }
  return ''
}
</script>
