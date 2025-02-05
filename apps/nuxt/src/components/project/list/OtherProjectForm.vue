<template>
  <div
    id="other-project-contact"
    ref="teeOtherProjectFormContainer"
    class="fr-bg--blue--lightness fr-grid-row fr-p-2w fr-mt-5v"
  >
    <TeeForm
      :form-container-ref="teeOtherProjectFormContainer"
      hint-class="fr-col-lg-9 fr-text--bold fr-h6 fr-pt-4v"
      :show-title="false"
      :show-c-e-logo="true"
      :title="Translation.t('otherProject.form.title')"
      :phone-callback="Translation.t('form.phoneContactCE')"
      :form-type="OpportunityType.CustomProject"
      :form="Opportunity.getOtherProjectFormFields()"
      :hint="Translation.t('otherProject.form.hint')"
      :error-email-subject="Translation.t('otherProject.form.errorEmail.subject', { titre: '' })"
    />
  </div>
</template>
<script setup lang="ts">
import { OpportunityType } from '@/types'
import Opportunity from '@/tools/opportunity'
import Translation from '@/tools/translation'

// ajouter custom project
const teeOtherProjectFormContainer = useTemplateRef<HTMLElement>('teeOtherProjectFormContainer')
</script>
