<template>
  <div teste2e-select="callback-contact-form">
    <!-- MESSAGE IF ERROR-->
    <TeeError
      v-if="!hasValidResponse"
      teste2e-selector="error-callback-contact-form"
      :mailto="getMailTo()"
      :email="Contact.email"
    >
      <h4 class="fr-text--deep-red fr-text--lg fr-m-0">
        {{ Translation.t(`form.notSent`) }}
      </h4>
    </TeeError>

    <!-- MESSAGE IF 200 -->
    <div
      v-if="hasValidResponse"
      teste2e-selector="success-callback-contact-form"
      class="fr-text-center"
    >
      <p class="fr-text--blue-france">
        <span
          class="fr-icon-checkbox-circle-fill fr-icon--lg"
          aria-hidden="true"
        />
      </p>
      <h3 class="fr-text--blue-france">
        {{ Translation.t(`form.sent`) }}
      </h3>
      <h6 class="fr-mt-15v fr-mb-3v">
        {{ Translation.t('form.nowWhat') }}
      </h6>
      <slot name="phoneContact" />
      <Feedback
        title="Aidez-nous à améliorer ce service"
        title-class="fr-text--blue-france fr-h4"
        class="fr-bg--white fr-p-3w"
        :position="FeedbackButtonPosition.Form"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import Contact from '@/tools/contact'
import Translation from '@/tools/translation'
import { FeedbackButtonPosition, FormDataType, type ReqResp } from '@/types'

interface Props {
  form: FormDataType
  requestResponse: ReqResp | undefined
  errorEmailSubject: string
}
const props = defineProps<Props>()

const hasValidResponse = computed(() => {
  return !props.requestResponse || props.requestResponse.status === 200 || props.requestResponse.status === 201
})

const getMailTo = (): string => {
  if (props.form) {
    const needsValue = props.form.needs.value ? props.form.needs.value : ''
    const nameValue = props.form.name.value ? props.form.name.value : ''
    const surnameValue = props.form.surname.value ? props.form.surname.value : ''
    const telValue = props.form.tel.value ? props.form.tel.value : ''
    const siretValue = props.form.siret.value ? props.form.siret.value : ''
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
