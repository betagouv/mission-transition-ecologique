<template>
  <DsfrButton
    :label="project?.nameTag"
    secondary
    size="sm"
    :class="`fr-radius-a--2v fr-mx-1v fr-btn--secondary--${color}`"
  />
</template>
<script setup lang="ts">
import { ProjectId, Project } from '@tee/common/src/project/types'
import { useProjectStore } from '@/stores/project'

interface Props {
  projects: Project[]
  projectId: ProjectId
  color: string | undefined
}
const projectStore = useProjectStore()

const props = defineProps<Props>()
const project = computed(() => projectStore.getProjectById(props.projects, props.projectId))
</script>
