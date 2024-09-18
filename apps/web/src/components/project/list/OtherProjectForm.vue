<template>
  <div
    id="project-contact"
    ref="TeeOtherProjectFormContainer"
    class="fr-tee-form-block fr-p-4v"
  >
    <TeeForm
      :form-container-ref="TeeOtherProjectFormContainer"
      :form-type="FormType.Project"
      :form="Opportunity.getOtherProjectFormFields()"
      data-id="other-project-id"
      data-slug="other-project-slug"
      hint="Test"
      error-email-subject="Test"
    />
  </div>
</template>
<script setup lang="ts">
import { FormType } from '@/types'
import Opportunity from '@/utils/opportunity'

const TeeOtherProjectFormContainer = ref<HTMLElement | null | undefined>(null)
</script>
