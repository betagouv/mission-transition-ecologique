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
      <p class="fr-hidden fr-unhidden-md fr-mb-0">Ces entreprises sont passées à l'action et en récoltent déjà les bénéfices.</p>
      <LazyTestimony
        v-for="(testimony, index) in testimoniesToDisplay"
        :key="testimony.slug"
        class="fr-mt-4w fr-pl-md-4w fr-pl-0"
        :class="[index === testimoniesToDisplay.length - 1 ? ' fr-bg-sm--none fr-pb-3v' : 'fr-mb-4w']"
        :testimony="testimony"
      />
    </template>
  </TeeContentBlock>
</template>

<script lang="ts" setup>
import { ProjectType, Testimony } from '@/types' // adjust path as needed

const { default: testimoniesJson } = await import('@/public/json/testimony/testimonies.json')
const testimonies = testimoniesJson as unknown as Testimony[]

const props = defineProps<{
  project: ProjectType | undefined
}>()

const testimoniesToDisplay = computed(() => {
  if (!props.project) {
    return []
  }
  return testimonies.filter((testimony) => testimony.projects?.includes(props.project!.id))
})

const hasTestimony = computed(() => {
  if (!props.project) {
    return false
  }
  return testimonies.some((testimony) => testimony.projects?.includes(props.project!.id))
})
</script>
