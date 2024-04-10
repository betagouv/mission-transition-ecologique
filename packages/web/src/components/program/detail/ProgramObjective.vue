<template>
  <div class="fr-mb-0v fr-mb-md-12v fr-mr-4v fr-mr-md-0">
    <h3>
      {{ getProgramObjectiveTitle() }}
    </h3>
    <div class="fr-tee-description-list">
      <p
        v-for="(paragraph, idx) in program.objectifs"
        :key="`description-paragraph-${idx}`"
        class="fr-mb-3v"
      >
        <span class="fr-tee-description-paragraph-marker"> {{ idx + 1 }} | </span>
        <span class="fr-tee-description-paragraph-content">
          {{ paragraph }}
        </span>
        <span v-if="program.liens && haslink(idx)">
          <br />
          <template v-for="linkId in possibleLinkIds">
            <a
              v-if="program.liens[`Objectif${idx + 1} lien${linkId}`]"
              :key="`link-${idx}-${linkId}`"
              :href="program.liens[`Objectif${idx + 1} lien${linkId}`].lien"
            >
              {{ program.liens[`Objectif${idx + 1} lien${linkId}`].texte }}
            </a>
          </template>
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`ProgramObjective > FUNCTION_NAME > MSG_OR_VALUE :`)

import Translation from '@/utils/translation'
import type { ProgramData } from '@/types'
import { ProgramAidType } from '@tee/common/src/program/types'

interface Props {
  program: ProgramData
}

const props = defineProps<Props>()

const getProgramObjectiveTitle = () => {
  switch (props.program["nature de l'aide"]) {
    case ProgramAidType.acc:
    case ProgramAidType.train:
    case ProgramAidType.loan:
    case ProgramAidType.tax:
      return Translation.t('program.programObjective.title.inProgram')
    case ProgramAidType.fund:
      return Translation.t('program.programObjective.title.applicationSteps')
  }
}

const possibleLinkIds = [1, 2, 3]

const haslink = (objectiveId: number) => {
  if (!props.program.liens) return false
  for (const linkId of possibleLinkIds) {
    const linkName = `Objectif${objectiveId + 1} lien${linkId}`
    if (props.program.liens[linkName]) return true
  }
  return false
}
</script>
