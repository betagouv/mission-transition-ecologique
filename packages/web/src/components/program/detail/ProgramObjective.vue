<template>
  <div class="fr-mb-0v fr-mb-md-12v fr-mr-4v fr-mr-md-0">
    <h3>
      {{ getProgramObjectiveTitle() }}
    </h3>
    <div class="fr-tee-description-list">
      <div
        v-for="(paragraph, idx) in program.objectifs"
        :key="`description-paragraph-${idx}`"
        class="fr-mb-3v"
      >
        <div>
          <span class="fr-tee-description-paragraph-marker"> {{ idx + 1 }} | </span>
          <span class="fr-tee-description-paragraph-content">
            {{ paragraph }}
          </span>
        </div>
        <div
          v-if="program.liens && haslink(idx + 1)"
          class="fr-mt-md-2v fr-ml-md-6w"
        >
          <template
            v-for="linkId in possibleLinkIds"
            :key="`link-${idx}-${linkId}`"
          >
            <TeeButtonLink
              v-if="program.liens[`Objectif${idx + 1} lien${linkId}`]"
              :key="`link-${idx}-${linkId}`"
              :href="program.liens[`Objectif${idx + 1} lien${linkId}`].lien"
              :download="isDownload(idx + 1, linkId)"
              >{{ program.liens[`Objectif${idx + 1} lien${linkId}`].texte }}</TeeButtonLink
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
import TeeButtonLink from '@/components/element/TeeButtonLink.vue'
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

const possibleLinkIds = [1, 2, 3] // To improve, may break in future versions

const haslink = (objectiveId: number) => {
  if (!props.program.liens) return false
  for (const linkId of possibleLinkIds) {
    const linkName = `Objectif${objectiveId} lien${linkId}`
    if (props.program.liens[linkName]) return true
  }
  return false
}

const isDownload = (objectiveId: number, linkId: number) => {
  const linkName = `Objectif${objectiveId} lien${linkId}`
  return props.program.liens[linkName].telechargement == 'oui'
}
</script>
