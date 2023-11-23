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
      return choices.t('program.programObjective.title.base')
    case ProgramAidType.fund:
      return choices.t('program.programObjective.title.second')
  }
}

const choices = choicesStore()
</script>
