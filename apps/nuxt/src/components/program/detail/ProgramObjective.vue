<template>
  <div class="fr-mb-0v fr-mb-md-6v fr-mr-4v fr-mr-md-0">
    <h3>{{ getProgramObjectiveTitle() }}</h3>
    <ol class="fr-order-list">
      <li
        v-for="(content, idx) in program.objectifs"
        :key="`description-paragraph-${idx}`"
        class="fr-mb-4v fr-mb-md-2v"
      >
        <div class="fr-mb-0 fr-ml-0">
          <div
            class="fr-tee-description-paragraph-content markdown-spacing-reset"
            v-html="markdownToHtml(content.description)"
          />
        </div>
        <div v-if="content.liens">
          <template
            v-for="(link, linkId) in content.liens"
            :key="`link-${idx}-${linkId}`"
          >
            <TeeButtonExternalLink
              v-if="link.lien"
              :href="link.lien"
              class="fr-mb-1v fr-mr-md-2v"
            >
              {{ link.texte }}
            </TeeButtonExternalLink>
            <DsfrButton
              v-if="link.formulaire && props.isCTAToFormVisible"
              secondary
              icon="fr-icon-mail-line"
              size="md"
              class="fr-mb-1v fr-mr-md-2v overwrite-button-style"
              :on-click="props.scrollToForm"
            >
              {{ Translation.t('program.CTAButton') }}
            </DsfrButton>
          </template>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import TeeButtonExternalLink from '@/components/element/button/TeeButtonExternalLink.vue'
import Translation from '@/tools/translation'
import { Marked } from '@/tools/marked'
import { ProgramAidType, type ProgramTypeForFront } from '@/types'

interface Props {
  program: ProgramTypeForFront
  formContainerRef: HTMLElement | null | undefined
  scrollToForm: () => void
  isCTAToFormVisible: boolean
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

const markdownToHtml = (text: string | undefined) => {
  return text ? Marked.toHtml(text) : ''
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/setting';

.markdown-spacing-reset > * {
  margin: 0;
}

.overwrite-button-style {
  box-shadow: inset 0 0 0 1px setting.$purple;
  color: setting.$purple !important;
  text-align: center;
  font-size: 0.875rem;
}
</style>
