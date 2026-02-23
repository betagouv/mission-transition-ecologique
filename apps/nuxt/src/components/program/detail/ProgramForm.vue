<template>
  <div
    v-if="currentProgram"
    class="fr-bg--blue--lightness fr-grid-row fr-p-2w fr-flex-direction--column"
  >
    <TeeForm
      v-if="form"
      :data-id="currentProgram.id"
      :show-c-e-logo="true"
      :phone-callback="phoneCallback"
      :form="form"
      :form-type="OpportunityType.Program"
      :error-email-subject="errorEmailSubject"
      :hint="hint"
      :form-container-ref="formContainerRef"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProgramStore } from '@/stores/program'
import Opportunity from '@/tools/opportunity'
import Translation from '@/tools/translation'
import { OpportunityType } from '@/types'

interface Props {
  formContainerRef: HTMLElement | null | undefined
}
defineProps<Props>()

const { currentProgram } = storeToRefs(useProgramStore())

const form = computed(() => {
  if (!currentProgram.value) {
    return undefined
  }

  return Opportunity.getProgramFormFields(currentProgram.value)
})

const phoneCallback = computed(() => Translation.t('form.phoneContactCE'))

const errorEmailSubject = computed(() =>
  Translation.t('program.form.errorEmail.subject', {
    program: currentProgram.value?.titre
  })
)

const hint = computed(() =>
  Translation.t('program.form.hint', {
    operator: currentProgram.value?.['opérateur de contact']
  })
)
</script>
