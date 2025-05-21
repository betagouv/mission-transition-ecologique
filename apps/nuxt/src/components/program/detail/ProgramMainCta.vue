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
      secondary
      size="lg"
      icon="fr-icon-chat-3-line"
      class="fr-ml-3v"
      :on-click="handleContactClick"
    >
      {{ Translation.t('program.CtaContact') }}
    </DsfrButton>
  </div>
</template>

<script setup lang="ts">
import Translation from '@/tools/translation'
import { useCompanyDataStore } from '@/stores/companyData'
import { storeToRefs } from 'pinia'
import { ProgramTypeForFront } from '@/types'

interface Props {
  program: ProgramTypeForFront
  isActivationVisible: Ref<boolean>
  scrollToForm: () => void
  scrollToActivation: () => void
}
const props = defineProps<Props>()

const handleContactClick = () => {
  const contact = props.program['contact question']
  if (contact === 'formulaire') {
    props.scrollToForm()
  } else if (typeof contact === 'string' && contact.startsWith('http')) {
    window.open(contact, '_blank')
  } else {
    window.location.href = `mailto:${contact}`
  }
}

const { isDataFull } = storeToRefs(useCompanyDataStore())
</script>
