<template>
  <TeeContentBlock
    v-for="(description, index) in projectDescription"
    :id="`project-${index}-details-title`"
    :key="`project-${index}-details-title`"
    class="fr-pt-3v fr-pb-6v"
    :title="description.title"
    :border-position="[BorderPosition.bottom]"
  >
    <template #content>
      <div v-html="markdownToHtml(description.details)" />
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import { BorderPosition, Project } from '@/types'
import { Marked } from '@/utils/marked'

interface Props {
  project: Project
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

const markdownToHtml = (text: string | undefined) => {
  if (text) {
    return Marked.toHtml(text)
  }
  return ''
}
</script>
