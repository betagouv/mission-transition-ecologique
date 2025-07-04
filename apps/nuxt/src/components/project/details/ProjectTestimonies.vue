<template>
  <TeeContentBlock
    v-if="hasTestimony"
    id="project-testimonies-title"
    class="fr-py-5v fr-border-b--grey--light"
    title="🌟 Elles l'ont fait !"
    container-from="md"
    title-class="fr-h4"
    title-tag="h2"
  >
    <template #content>
      <p class="fr-hidden fr-unhidden-md">Ces entreprises sont passées à l'action et en récoltent déjà les bénéfices.</p>
      <Testimony
        v-for="(testimony, index) in testimoniesToDisplay"
        :key="testimony.slug"
        :class="[index === testimoniesToDisplay.length - 1 ? 'fr-mt-6w remove-mobile-border' : 'fr-my-6w']"
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

const hasTestimony = computed(() => {
  if (!props.project) return false
  return testimonies.some((testimony) => testimony.projects?.includes(props.project!.id))
})
</script>

<style scoped lang="scss">
@media (width <= 767.98px) {
  .remove-mobile-border {
    background-image: none !important;
  }
}
</style>
