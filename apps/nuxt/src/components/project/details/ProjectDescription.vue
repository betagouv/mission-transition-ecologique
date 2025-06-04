<template>
  <TeeContentBlock
    v-for="(description, index) in projectDescription"
    :id="`project-${index}-details-title`"
    :key="`project-${index}-details-title`"
    class="fr-py-6v fr-border-b--grey--light"
    :title="description.title"
    container-from="md"
  >
    <template #content>
      <div v-html="Marked.toHtml(description.details)" />
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import { ProjectType } from '@/types'
import { Marked } from '@/tools/marked'

interface Props {
  project: ProjectType
}

const props = defineProps<Props>()

interface ContentProps {
  description: {
    title: string
    details: string
  }
  more: {
    title: string
    details: string
  }
}

const projectDescription = ref<ContentProps>({
  description: {
    title: "❓ Qu'est ce que c'est ?",
    details: props.project.longDescription
  },
  more: {
    title: '📚 Pour aller plus loin',
    details: props.project.moreDescription
  }
})
</script>
