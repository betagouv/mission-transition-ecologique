<template>
  <div class="fr-col-12 fr-col-md-8">
    <!-- MESSAGE IF ERROR-->
    <TeeError
      v-if="!hasValidResponse"
      :mailto="getMailTo()"
      :email="Contact.email"
    >
      <h3 class="tee-form-response tee-form-response-error">
        {{ Translation.t(`form.notSent`) }}
      </h3>
    </TeeError>

    <!-- MESSAGE IF 200 -->
    <div
      v-if="hasValidResponse"
      class="fr-text-center"
    >
      <p class="tee-form-response tee-form-response-blue">
        <v-icon
          name="ri-checkbox-circle-fill"
          aria-hidden="true"
          scale="3"
        />
      </p>
      <h3 class="tee-form-response tee-form-response-blue">
        {{ Translation.t(`form.sent`) }}
      </h3>
      <h6 class="fr-mt-15v fr-mb-3v">
        {{ Translation.t('form.nowWhat') }}
      </h6>
      <slot name="phoneContact" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Translation from '@/utils/translation'
import Contact from '@/utils/contact'
import { OpportunityFormType, type ReqResp } from '@/types'

interface Props {
  opportunityForm: OpportunityFormType
  requestResponse: ReqResp | undefined
  errorEmailSubject: string
}
const props = defineProps<Props>()

const hasValidResponse = computed(() => {
  return !props.requestResponse || props.requestResponse.status === 200 || props.requestResponse.status === 201
})

const getMailTo = (): string => {
  if (props.opportunityForm.value) {
    const needsValue = props.opportunityForm.needs.value ? props.opportunityForm.needs.value : ''
    const nameValue = props.opportunityForm.name.value ? props.opportunityForm.name.value : ''
    const surnameValue = props.opportunityForm.surname.value ? props.opportunityForm.surname.value : ''
    const telValue = props.opportunityForm.tel.value ? props.opportunityForm.tel.value : ''
    const siretValue = props.opportunityForm.siret.value ? props.opportunityForm.siret.value : ''
    return Contact.getMailtoUrl(
      props.errorEmailSubject,
      `${needsValue}
  
  ${nameValue} ${surnameValue}
  ${telValue}
  SIRET : ${siretValue}`
    )
  }

  return ''
}
</script>
