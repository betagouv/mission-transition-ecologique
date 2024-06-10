<template>
  <div>
    <DsfrCard
      :description="option.description"
      :title="option.title"
      :img-src="option.imgSrc"
      title-tag="h4"
      :horizontal="false"
    >
      <template #end-details>
        <TeeDsfrTags
          v-model="selectedProject"
          :tags="option.tags"
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
const selectedProject: string = ''
</script>
