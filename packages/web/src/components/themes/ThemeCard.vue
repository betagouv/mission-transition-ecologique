<template>
  <div>
    <DsfrCard
      description=""
      :title="option.title"
      :img-src="option.imgSrc"
      img-ratio="lg"
      title-tag="h4"
      :class="`fr-card__header--${option.color}`"
      :horizontal="false"
    >
      <template #start-details>
        <div :class="`fr-p-0 fr-bg--${option.color} themeDivider`" />
      </template>
      <template #end-details>
        <ThemeProjectTag
          v-for="project in option.tags"
          :id="project.id"
          :key="project.id"
          :label="project.nameTag"
          :color="option.color"
        />
      </template>
    </DsfrCard>
  </div>
</template>
<script setup lang="ts">
import { ThemeObjective } from './ThemeSelect.vue'

interface Props {
  option: ThemeObjective
}
defineProps<Props>()
</script>
<style scoped>
.themeDivider {
  height: 6px;
  width: 30%;
}
</style>
