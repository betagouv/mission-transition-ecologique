<template>
  <TeeContentBlock
    id="project-linked-projects-title"
    class="fr-py-5v fr-border-b--grey--light"
    title="Elles l'ont fait !"
    container-from="md"
    title-class="fr-h4"
    title-tag="h2"
  >
    <template #content>
      <p>Ces entreprises sont passées à l'action et en récoltent déjà les bénéfices.</p>
      <Testimony
        v-for="testimony in testimoniesToDisplay"
        :key="testimony.slug"
        class="fr-my-4v"
        :testimony="testimony"
      />
    </template>
  </TeeContentBlock>
</template>

<script lang="ts" setup>
import type { ProjectType } from '@/types' // adjust path as needed
import { testimonies } from '@tee/data/static'

const props = defineProps<{
  project: ProjectType | undefined
}>()

const testimoniesToDisplay = computed(() => {
  if (!props.project) return []
  return testimonies.filter((testimony) => testimony.projects?.includes(props.project!.id))
})
</script>
