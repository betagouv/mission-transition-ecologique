<template>
  <div class="fr-mb-0v fr-mb-md-6v fr-mr-4v fr-mr-md-0">
    <h3>
      {{ getProgramObjectiveTitle() }}
    </h3>
    <div class="fr-tee-description-list">
      <div
        v-for="(content, idx) in program.objectifs"
        :key="`description-paragraph-${idx}`"
        class="fr-mb-4v fr-mb-md-2v"
      >
        <p class="fr-mb-2v fr-mb-md-1v fr-ml-md-0 fr-ml-n2w">
          <span class="fr-tee-description-paragraph-marker"> {{ idx + 1 }} | </span>
          <span class="fr-tee-description-paragraph-content">
            {{ content.description }}
          </span>
        </p>
        <div
          v-if="content.liens"
          class="fr-ml-4w fr-ml-md-6w"
        >
          <template
            v-for="(link, linkId) in content.liens"
            :key="`link-${idx}-${linkId}`"
          >
            <TeeButtonExternalLink
              :href="link.lien"
              class="fr-mb-1v fr-mr-md-2v"
            >
              {{ link.texte }}
            </TeeButtonExternalLink>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeeButtonExternalLink from '@/components/element/button/TeeButtonExternalLink.vue'
import Translation from '@/tools/translation'
import { ProgramAidType, type ProgramType } from '@/types'

interface Props {
  program: ProgramType
}

const props = defineProps<Props>()

const getProgramObjectiveTitle = () => {
  switch (props.program["nature de l'aide"]) {
    case ProgramAidType.study:
    case ProgramAidType.train:
    case ProgramAidType.loan:
    case ProgramAidType.tax:
      return Translation.t('program.programObjective.title.inProgram')
    case ProgramAidType.fund:
      return Translation.t('program.programObjective.title.applicationSteps')
  }
}
</script>
