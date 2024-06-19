<template>
  <DsfrAccordion
    id="project-linked-projects"
    title="Projets complémentaires"
    title-tag="h2"
    :expanded-id="expandedId"
    @expand="expandRelatedProjects"
  >
    <TeeDsfrTags :tags="relatedProjectsTags" />
  </DsfrAccordion>
</template>
<script setup lang="ts">
import { Project } from '@tee/common/src/project/types'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'

interface Props {
  relatedProjects: Project[]
}
const props = defineProps<Props>()
const expandedId = ref<string | undefined>('project-linked-projects')
const expandRelatedProjects = (id: string | undefined) => {
  expandedId.value = id
}
const relatedProjectsTags: TeeDsfrTagProps[] = props.relatedProjects.map((project: Project) => {
  return { value: project.id, label: project.nameTag, name: 'button' }
})
</script>
