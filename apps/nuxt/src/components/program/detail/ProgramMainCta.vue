<template>
  <!--  <TeeRegisterHighlight-->
  <!--    v-if="!isDataFull"-->
  <!--    :text="Translation.t('program.programRegisterHighlightText')"-->
  <!--  />-->
  <div v-if="isActivationVisible">
    <DsfrButton
      size="lg"
      icon="fr-icon-check-line"
      class="fr-mt-3v fr-mr-3v"
      :on-click="() => scrollToActivation()"
    >
      {{ Translation.t('program.ctaActivation') }}
    </DsfrButton>
    <DsfrButton
      v-if="program?.['contact question'] === 'formulaire'"
      secondary
      size="lg"
      class="fr-mt-3v"
      icon="fr-icon-chat-3-line"
      :on-click="() => scrollToForm()"
    >
      {{ Translation.t('program.ctaContact') }}
    </DsfrButton>
    <TeeButtonExternalLink
      v-else-if="program?.['contact question']"
      :href="program?.['contact question']"
      variant="large-question"
      class="fr-mt-3v"
      @click="trackAnalytics"
    >
      {{ Translation.t('program.ctaContact') }}
    </TeeButtonExternalLink>
  </div>
</template>

<script setup lang="ts">
import AbstractProgram from '@/tools/program/abstractProgram'
import Translation from '@/tools/translation'
import Analytics from '@/tools/analytic/analytics'
import { CompanyData } from '@/tools/companyData'

interface Props {
  isActivationVisible: boolean
  scrollToForm: () => void
  scrollToActivation: () => void
}
defineProps<Props>()

const program = AbstractProgram.getCurrent()
// const { isDataFull } = storeToRefs(useCompanyDataStore())

const trackAnalytics = () => {
  Analytics.sendEvent('program_external_question_contact', {
    link: program.value?.['contact question'],
    url: window.location.href,
    company: CompanyData.toString()
  })
}
</script>
