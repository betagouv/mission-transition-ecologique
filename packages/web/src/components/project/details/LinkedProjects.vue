<template>
  <div>
    <div class="fr-h3">Projets complémentaires</div>
    <TeeDsfrTags :tags="relatedProjectsTags" />
  </div>
</template>
<script setup lang="ts">
import { Project } from '@tee/common/src/project/types'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'

interface Props {
  relatedProjects: Project[]
}
const props = defineProps<Props>()

const relatedProjectsTags: TeeDsfrTagProps[] = props.relatedProjects.map((project: Project) => {
  return { value: project.id, label: project.nameTag, name: 'button' }
})
</script>
