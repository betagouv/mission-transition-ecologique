<template>
  <div
    id="project-contact"
    ref="TeeOtherProjectFormContainer"
    class="fr-bg--blue-france--lightness fr-col-justify--center fr-grid-row fr-p-2w fr-mt-2v"
  >
    <TeeForm
      :form-container-ref="TeeOtherProjectFormContainer"
      :form-type="OpportunityType.CustomProject"
      :form="Opportunity.getOtherProjectFormFields()"
      :hint="Translation.t('otherProject.form.hint')"
      :error-email-subject="Translation.t('otherProject.form.errorEmail.subject', { titre: '' })"
    />
  </div>
</template>
<script setup lang="ts">
import { OpportunityType } from '@/types'
import Opportunity from '@/utils/opportunity'
import Translation from '@/utils/translation'

// ajouter custom project
const TeeOtherProjectFormContainer = ref<HTMLElement | null | undefined>(null)
</script>
