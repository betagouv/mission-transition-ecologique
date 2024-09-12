<template>
  <div
    v-if="project.longDescription.length > 0"
    id="project-details-title"
    class="fr-container fr-pt-3v fr-pb-4v"
    style="border-bottom: solid 1px #e5e5e5"
  >
    <div class="fr-h3">❓ Qu'est ce que c'est ?</div>
    <div v-html="markdownToHtml(project.longDescription)" />
  </div>

  <div
    v-if="project.moreDescription.length > 0"
    id="project-more-details-title"
    class="fr-container fr-pt-4v fr-pb-3w"
    style="border-bottom: solid 1px #e5e5e5"
  >
    <div class="fr-h3">📚 Pour aller plus loin</div>
    <div v-html="markdownToHtml(project.moreDescription)" />
  </div>
</template>
<script setup lang="ts">
import { Project } from '@/types'
import { Marked } from '@/utils/marked'

interface Props {
  project: Project
}

defineProps<Props>()

const markdownToHtml = (text: string | undefined) => {
  if (text) {
    return Marked.toHtml(text)
  }
  return ''
}
</script>
