<template>
  <ProgramAccordion
    v-if="currentProgram && currentProgram['conditions d\'éligibilité']"
    id="eligibilite"
    :accordion-id="`${currentProgram.id}-eligibility`"
    :title="Translation.t('program.programAmIEligible')"
  >
    <ProgramEligibilityConditions :program="currentProgram" />
    <TeeRegisterHighlight
      v-if="!isDataFull"
      :text="Translation.t('program.programRegisterHighlightText')"
    />
  </ProgramAccordion>
  <ProgramAccordion
    v-if="currentProgram && linkedProjects && linkedProjects.length > 0"
    id="linked-projects"
    :accordion-id="`${currentProgram.id}-linked-projects`"
    :title="Breakpoint.isMobile() ? Translation.t('program.projectExamplesSM') : Translation.t('program.projectExamples')"
  >
    <ProgramProjects :linked-projects="linkedProjects" />
  </ProgramAccordion>
  <ProgramAccordion
    v-if="currentProgram && currentProgram['description longue']"
    id="long-description"
    :accordion-id="`${currentProgram.id}-long-description`"
    :title="Translation.t('program.programKnowMore')"
  >
    <ProgramLongDescription :program="currentProgram" />
  </ProgramAccordion>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import Program from '@/tools/program/program'
import Translation from '@/tools/translation'
import Breakpoint from '@/tools/breakpoints'
import { storeToRefs } from 'pinia'

const { currentProgram } = storeToRefs(useProgramStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())
const { projects } = storeToRefs(useProjectStore())

const linkedProjects = computed(() => {
  return Program.getLinkedProjects(currentProgram.value, projects.value)
})
</script>
