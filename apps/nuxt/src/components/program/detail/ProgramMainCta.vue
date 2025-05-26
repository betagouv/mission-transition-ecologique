<template>
  <TeeRegisterHighlight
    v-if="!isDataFull"
    :text="Translation.t('program.programRegisterHighlightText')"
  />
  <div v-if="isDataFull && isActivationVisible">
    <DsfrButton
      size="lg"
      icon="fr-icon-mail-line"
      class="fr-ml-3v fr-mb-3v"
      :on-click="() => scrollToActivation()"
    >
      {{ Translation.t('program.CtaActivation') }}
    </DsfrButton>
    <DsfrButton
      v-if="program['contact question'] === 'formulaire'"
      secondary
      size="lg"
      icon="fr-icon-chat-3-line"
      class="fr-ml-3v"
      :on-click="() => scrollToForm()"
    >
      {{ Translation.t('program.CtaContact') }}
    </DsfrButton>
    <TeeButtonExternalLink
      v-else
      :href="formattedContactHref"
      variant="large-question"
      class="fr-ml-3v"
    >
      {{ Translation.t('program.CtaContact') }}
    </TeeButtonExternalLink>
  </div>
</template>

<script setup lang="ts">
import Translation from '@/tools/translation'
import { useCompanyDataStore } from '@/stores/companyData'
import { storeToRefs } from 'pinia'
import { ProgramTypeForFront } from '@/types'

interface Props {
  program: ProgramTypeForFront
  isActivationVisible: boolean
  scrollToForm: () => void
  scrollToActivation: () => void
}
const props = defineProps<Props>()

const { isDataFull } = storeToRefs(useCompanyDataStore())

const formattedContactHref = computed(() => {
  const contact = props.program['contact question']
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
  return isEmail ? `mailto:${contact}` : contact
})
</script>
