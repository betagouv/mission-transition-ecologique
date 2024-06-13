<template>
  <DsfrAccordion
    id="project-details"
    title="❓ Qu'est ce que c'est ?"
    title-tag="h2"
    :expanded-id="expandedId"
    @expand="expandDetails"
  >
    <div v-html="formatProjectDescription(projectDescription)" />
  </DsfrAccordion>

  <DsfrAccordion
    id="project-more-details"
    title="📚 Pour aller plus loin"
    title-tag="h2"
    :expanded-id="expandedMoreId"
    @expand="expandMoreDetails"
  >
    <div v-html="formatProjectDescription(projectMoreDescription)" />
  </DsfrAccordion>
</template>
<script setup lang="ts">
import { marked } from 'marked'

interface Props {
  projectDescription: string | undefined
  projectMoreDescription: string | undefined
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
