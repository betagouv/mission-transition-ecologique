<template>
  <div
    class="fr-btn highlighted-project fr-btn--secondary fr-btn--sm inline-flex fr-radius-a--2v fr-mx-1v fr-my-1v fr-btn--secondary--green"
    :class="`fr-btn--secondary--${color}`"
  >
    <span class="highlighted-project-tag">{{ project.nameTag }}</span>
  </div>
</template>
<script setup lang="ts">
import { Project } from '@tee/data'
import { Color } from '@/types'

interface Props {
  project: Project
  color: Color
}
defineProps<Props>()
</script>
<style scoped>
.highlighted-project-tag {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.highlighted-project {
  max-width: 90%;
}
</style>
