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
      :on-click="() => scrollToForm()"
    >
      {{ Translation.t('program.CtaContact') }}
    </DsfrButton>
  </div>
</template>

<script setup lang="ts">
import Translation from '@/tools/translation'
import { useCompanyDataStore } from '@/stores/companyData'
import { storeToRefs } from 'pinia'

interface Props {
  isActivationVisible: Ref<boolean>
  scrollToForm: () => void
  scrollToActivation: () => void
}
defineProps<Props>()

//TODO SCROLLS should be just one option depending on the input data.

const { isDataFull } = storeToRefs(useCompanyDataStore())
</script>
