<template>
  <TeeBanner
    :bg-color="themeColor"
    :has-gradient="true"
    :bg-image="project.image"
    :img-alt="`image / ${project.title}`"
    :content-alignment="{ v: 'bottom', h: 'left' }"
    class="project-header"
  >
    <template #title>
      <div class="fr-col-12 fr-col-md-9 fr-col-xl-10 fr-col-offset-md-3 fr-col-offset-xl-2 fr-text-left fr-pb-8v">
        <div class="fr-container-md">
          <h1 class="fr-gradient__title">{{ project.title }}</h1>
        </div>
      </div>
    </template>
  </TeeBanner>
</template>
<script setup lang="ts">
import { Color, ProjectType } from '@/types'

interface Props {
  project: ProjectType
  themeColor?: Color
}
defineProps<Props>()
</script>

<style scoped lang="scss">
.project-header {
  height: 400px;
}
</style>
