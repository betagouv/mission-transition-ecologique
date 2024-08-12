<template>
  <div>PROJETS</div>
</template>
<script lang="ts" setup>
import type { ProgramData } from '@/types'
import Program from '@/utils/program/program'
import { useProjectStore } from '@/stores/project'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  program: ProgramData
}
const props = defineProps<Props>()
const projectStore = useProjectStore()

onBeforeMount(async () => {
  useNavigationStore().hasSpinner = true

  const projectResult = await projectStore.projects
  if (projectResult.isOk) {
    Program.getLinkedProjects(props.program, projectResult.value)
  }
})
</script>
