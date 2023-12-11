<template>
  <div
    class='fr-mb-18v'>
    <h3>
      {{ getProgramObjectiveTitle() }}
    </h3>
    <div class='fr-tee-description-list'>
      <p
        v-for='(paragraph, idx) in program.objectifs'
        :key='`description-paragraph-${idx}`'
        class='fr-mb-6v'
      >
        <span class='fr-tee-description-paragraph-marker'>
          {{ idx + 1 }} |
        </span>
        <span class='fr-tee-description-paragraph-content'>
          {{ paragraph }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang='ts'>

// CONSOLE LOG TEMPLATE
// console.log(`ProgramObjective > FUNCTION_NAME > MSG_OR_VALUE :`)

import { choicesStore } from '@tee/web/src/stores/choices'
import type { ProgramData } from '@/types'
import { ProgramAidType } from '@/types'

interface Props {
  program: ProgramData,
}

const props = defineProps<Props>()

const getProgramObjectiveTitle = () => {
  switch (props.program['nature de l\'aide']) {
    case ProgramAidType.acc:
    case ProgramAidType.train:
    case ProgramAidType.loan:
    case ProgramAidType.tax:
      return choices.t('program.programObjective.title.inProgram')
    case ProgramAidType.fund:
      return choices.t('program.programObjective.title.applicationSteps')
  }
}

const choices = choicesStore()
</script>
