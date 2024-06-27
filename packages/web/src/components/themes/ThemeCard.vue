<template>
  <div>
    <DsfrCard
      :description="option.description"
      :title="option.title"
      :img-src="option.imgSrc"
      title-tag="h4"
      :class="`fr-bg--${option.color}--light`"
      :horizontal="false"
    >
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
