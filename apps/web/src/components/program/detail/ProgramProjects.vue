<template>
  <div
    v-if="projects.length > 0"
    class="fr-mt-2v"
  >
    <div class="fr-grid-row fr-grid-row--center fr-grid-row-md--left">
      <template
        v-for="linkedProject in projects"
        :key="linkedProject.id"
      >
        <TeeProjectButton
          :project="linkedProject"
          class="fr-my-1-5v fr-mx-2v"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { ProgramData, Project as ProjectType } from '@/types'
import Program from '@/utils/program/program'
import { useProjectStore } from '@/stores/project'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  program: ProgramData
}
const props = defineProps<Props>()
const projectStore = useProjectStore()
const projects = ref<ProjectType[]>([])

onBeforeMount(async () => {
  useNavigationStore().hasSpinner = true

  const projectResult = await projectStore.projects
  if (projectResult.isOk) {
    projects.value = Program.getLinkedProjects(props.program, projectResult.value)
  }
  useNavigationStore().hasSpinner = false
})
</script>
