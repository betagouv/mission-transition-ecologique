<template>
  <div>
    <DsfrCard
      :description="option.description"
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
          :label="project.label"
          :color="project.color"
        />
      </template>
    </DsfrCard>
  </div>
</template>
<script setup lang="ts">
interface Props {
  option: object
}
defineProps<Props>()
</script>
<style scoped>
.themeDivider {
  height: 6px;
  width: 30%;
}
</style>
