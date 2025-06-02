<template>
  <ProgramAccordion
    v-if="program && linkedProjects && linkedProjects.length > 0"
    id="linked-projects"
    :accordion-id="`${program.id}-linked-projects`"
    :title="Breakpoint.isMobile() ? Translation.t('program.projectExamplesSM') : Translation.t('program.projectExamples')"
  >
    <ul class="fr-grid-row fr-grid-row--center fr-grid-row-md--left fr-raw-list">
      <li
        v-for="linkedProject in linkedProjects"
        :key="linkedProject.id"
        class="fr-mr-4v"
      >
        <TeeProjectButton
          :project="linkedProject"
          target="_blank"
          class="fr-mb-1-5v"
        />
      </li>
    </ul>
  </ProgramAccordion>
</template>
<script lang="ts" setup>
import Translation from '@/tools/translation'
import { ProgramTypeForFront } from '@/types'
import Breakpoint from '@/tools/breakpoints'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import Program from '@/tools/program/program'

interface Props {
  program: ProgramTypeForFront
}
const { program } = defineProps<Props>()

const { projects } = storeToRefs(useProjectStore())

const linkedProjects = computed(() => {
  return Program.getLinkedProjects(program, projects.value)
})
</script>
