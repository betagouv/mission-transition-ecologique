<template>
  <div class="fr-mb-0v fr-mb-md-12v fr-mr-4v fr-mr-md-0">
    <h3>
      {{ getProgramObjectiveTitle() }}
    </h3>
    <div class="fr-tee-description-list">
      <div
        v-for="(paragraph, idx) in program.objectifs"
        :key="`description-paragraph-${idx}`"
        class="fr-mb-4v fr-mb-md-2v"
      >
        <p class="fr-mb-2v fr-mb-md-1v fr-ml-md-0 fr-ml-n2w">
          <span class="fr-tee-description-paragraph-marker"> {{ idx + 1 }} | </span>
          <span class="fr-tee-description-paragraph-content">
            {{ paragraph }}
          </span>
        </p>
        <div
          v-if="program.liens && haslink(idx + 1)"
          class="fr-ml-4w fr-ml-md-6w"
        >
          <template
            v-for="linkId in maxLinkByObjective"
            :key="`link-${idx}-${linkId}`"
          >
            <TeeButtonExternalLink
              v-if="program.liens[`Objectif${idx + 1} lien${linkId}`]"
              :key="`link-${idx}-${linkId}`"
              :href="program.liens[`Objectif${idx + 1} lien${linkId}`].lien"
              class="fr-mb-1v fr-mr-md-2v"
              >{{ program.liens[`Objectif${idx + 1} lien${linkId}`].texte }}</TeeButtonExternalLink
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`ProgramObjective > FUNCTION_NAME > MSG_OR_VALUE :`)
import TeeButtonExternalLink from '@/components/element/TeeButtonExternalLink.vue'
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

const maxLinkByObjective = 5

const haslink = (objectiveId: number) => {
  if (!props.program.liens) {
    return false
  }
  for (let linkId = 1; linkId <= maxLinkByObjective; linkId++) {
    const linkName = `Objectif${objectiveId} lien${linkId}`
    if (props.program.liens[linkName]) {
      return true
    }
  }
  return false
}
</script>
