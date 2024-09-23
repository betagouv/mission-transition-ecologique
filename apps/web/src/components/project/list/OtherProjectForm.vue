<template>
  <div
    id="project-contact"
    ref="TeeOtherProjectFormContainer"
    class="fr-bg--blue-light fr-grid-row fr-grid-row--center fr-p-4v"
  >
    <TeeForm
      :form-container-ref="TeeOtherProjectFormContainer"
      :form-type="FormType.Project"
      :form="Opportunity.getOtherProjectFormFields()"
      :hint="Translation.t('otherProject.form.hint')"
      :error-email-subject="Translation.t('form.errorEmail.subject', { titre: '' })"
    />
  </div>
</template>
<script setup lang="ts">
import { FormType } from '@/types'
import Opportunity from '@/utils/opportunity'
import Translation from '@/utils/translation'

const TeeOtherProjectFormContainer = ref<HTMLElement | null | undefined>(null)
</script>
