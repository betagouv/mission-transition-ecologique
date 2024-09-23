<template>
  <!-- BACK TO FORM BTN -->
  <TeeDsfrButton
    v-show="formIsSent"
    class="fr-btn fr-btn--tertiary-no-outline fr-col-10 fr-mb-3v fr-link"
    tertiary
    no-outline
    icon-only
    icon="ri-arrow-left-line"
    @click="formIsSent = !formIsSent"
  />
  <!-- FORM -->
  <div
    v-if="!formIsSent"
    ref="teeForm"
    class="fr-grid-row fr-px-md-4w"
  >
    <div class="fr-col-12">
      <!-- FORM LABEL -->
      <div
        id="form-title"
        class="fr-h3 fr-col-12 fr-text-center"
      >
        {{ Format.capitalize(Translation.t('form.label') || '') }}
      </div>
      <!-- FORM HINT -->
      <p class="fr-col-12 fr-text-center">{{ hint }}</p>
      <!-- FIELDS -->
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2v fr-mt-4v">
        <TeeFormElement
          v-for="fieldKey in Object.keys(localForm)"
          v-show="!localForm[fieldKey].hidden"
          :key="fieldKey"
          :field="localForm[fieldKey]"
          @update-field="(field) => (localForm[fieldKey] = field)"
        />
      </div>

      <!-- FORM HELPER -->
      <h6 class="fr-mb-0 fr-text--xs">
        <code>*</code>
        &nbsp;
        {{ Translation.t('form.mandatory') }}
      </h6>

      <!-- SEND / NEXT BUTTON -->
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mt-5v">
        <div class="fr-col-12 fr-col-justify--right">
          <TeeDsfrButton
            :label="Translation.t('send')"
            :disabled="!isFormFilled || !isFormValid"
            icon="ri-arrow-right-line"
            icon-right
            :loading="isLoading"
            @click="saveForm()"
          />
        </div>
      </div>
    </div>
  </div>
  <TeeFormCallback
    v-if="formIsSent"
    :form="form"
    :error-email-subject="errorEmailSubject"
    :request-response="requestResponse"
    class="fr-mt-5v fr-grid-row fr-grid-row--center fr-grid-row--middle"
  >
    <template
      v-if="formType === FormType.Program"
      #phoneContact
    >
      <p class="fr-mb-15v">
        <span>
          {{ phoneCallback }}
        </span>
      </p>
    </template>
  </TeeFormCallback>
</template>

<script setup lang="ts">
import { Scroll } from '@/utils/scroll'
import { computed, ref } from 'vue'
import { DefaultFieldFormType, type ReqResp, TrackId, FormDataType } from '@/types'
import Translation from '@/utils/translation'
import Opportunity from '@/utils/opportunity'
import TeeDsfrButton from '@/components/element/button/TeeDsfrButton.vue'
import Matomo from '@/utils/matomo'
import Format from '@/utils/format'
import OpportunityApi from '@/service/api/opportunityApi'
import { FormType } from '@tee/common'
import { useNavigationStore } from '@/stores/navigation'

const navigation = useNavigationStore()
interface Props {
  dataId?: string
  dataSlug?: string
  formType: FormType
  form: FormDataType
  hint: string
  errorEmailSubject: string
  phoneCallback?: string
  formContainerRef: HTMLElement | null | undefined
}

const props = defineProps<Props>()

const formIsSent = ref<boolean>(false)
const requestResponse = ref<ReqResp>()
const isLoading = ref<boolean>(false)
const localForm = ref<FormDataType>(props.form)
const isFormFilled = computed(() => {
  const isFilled = []
  for (const key in localForm.value) {
    if (localForm.value[key].required) {
      isFilled.push(isFieldValid(localForm.value[key]))
    }
  }
  return isFilled.every((v) => v)
})

const isFormValid = computed(() => {
  const isValid = []
  for (const key in localForm.value) {
    if (localForm.value[key].required) {
      isValid.push(localForm.value[key].isValid)
    }
  }
  return isValid.every((v) => v !== false)
})

const isFieldValid = (field: DefaultFieldFormType): boolean => {
  return field.value !== undefined && field.value !== '' && field.value !== false
}

const saveForm = async () => {
  try {
    isLoading.value = true
    let opportunity
    if (props.dataId && props.dataSlug) {
      opportunity = new OpportunityApi(localForm.value, props.dataId, props.dataSlug, props.formType)
    } else {
      opportunity = new OpportunityApi(
        localForm.value,
        Opportunity.getCustomId(localForm.value, props.formType),
        Opportunity.getCustomSlug(localForm.value, props.formType),
        props.formType
      )
    }
    requestResponse.value = await opportunity.fetch()

    // analytics / send event
    Matomo.sendEvent(TrackId.Results, getRouteName())
  } finally {
    isLoading.value = false
    formIsSent.value = true
    scrollToFormContainer()
  }
}
const getRouteName = () => {
  return `send_${props.formType}_form${navigation.isCatalogDetail() ? '_catalog' : ''}`
}
const scrollToFormContainer = () => {
  const element = props.formContainerRef
  if (element) {
    Scroll.toBlockCenter(element)
  }
}
</script>
