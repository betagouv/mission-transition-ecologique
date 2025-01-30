<template>
  <!-- BACK TO FORM BTN -->
  <TeeDsfrButton
    v-show="formIsSent"
    class="fr-btn fr-btn--tertiary-no-outline fr-col-10 fr-mb-3v"
    tertiary
    no-outline
    icon-only
    icon="fr-icon-arrow-left-line"
    @click="formIsSent = !formIsSent"
  />
  <!-- FORM -->
  <form
    v-if="!formIsSent"
    :name="formType"
    class="fr-grid-row fr-px-md-4w"
  >
    <div class="fr-col-12">
      <!-- FORM LABEL -->
      <div
        v-if="showTitle"
        id="form-title"
        class="fr-h3 fr-col-12 fr-text-center"
      >
        {{ title }}
      </div>
      <!-- FORM HINT -->
      <p
        :class="hintClass"
        class="fr-col-12 fr-m-auto fr-text-center"
      >
        {{ hint }}
      </p>
      <!-- FIELDS -->
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2v fr-mt-4v">
        <TeeFormElement
          v-for="fieldKey in Object.keys(localForm).filter(
            (fieldKey) => !(localForm as Record<string, InputFieldUnionType>)[fieldKey].hidden
          )"
          :key="fieldKey"
          v-model="(localForm as Record<string, InputFieldUnionType>)[fieldKey]"
          :field-key="fieldKey"
          :field="(localForm as Record<string, InputFieldUnionType>)[fieldKey]"
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
            type="submit"
            :disabled="!isFormFilled || !isFormValid || isLoading"
            icon="fr-icon-arrow-right-line"
            icon-right
            :loading="isLoading"
            @click.prevent="saveForm()"
          />
        </div>
      </div>
    </div>
  </form>
  <TeeFormCallback
    v-if="formIsSent"
    :form="form"
    :error-email-subject="errorEmailSubject"
    :request-response="requestResponse"
    class="fr-mt-5v fr-mx-auto fr-grid-row fr-grid-row--center fr-grid-row--middle"
  >
    <template #phoneContact>
      <p class="fr-mb-5v">
        <span v-html="phoneCallback"></span>
      </p>
      <img
        v-if="showCELogo"
        src="/images/logos/ce-logo-horizontal.svg"
        :alt="`image / logo-conseillers-entreprise`"
        width="280px"
      />
    </template>
  </TeeFormCallback>
</template>

<script setup lang="ts">
import Navigation from '@/tools/navigation'
import { Scroll } from '@/tools/scroll'
import { computed } from 'vue'
import { type ReqResp, TrackId, FormDataType, InputFieldUnionType, ProjectType } from '@/types'
import Translation from '@/tools/translation'
import TeeDsfrButton from '@/components/element/button/TeeDsfrButton.vue'
import Format from '@/tools/format'
import OpportunityApi from '@/tools/api/opportunityApi'
import { OpportunityType } from '@tee/common'
import Analytics from '@/tools/analytic/analytics'
import { ProgramType } from '@tee/data'

const navigation = new Navigation()
interface Props {
  dataId?: string
  showTitle?: boolean
  dataSlug?: ProgramType['id'] | ProjectType['slug']
  formType: OpportunityType
  form: FormDataType
  hint: string
  showCELogo?: boolean
  title?: string
  hintClass?: string
  errorEmailSubject: string
  phoneCallback?: string
  formContainerRef: HTMLElement | null | undefined
}

const props = withDefaults(defineProps<Props>(), {
  dataId: undefined,
  dataSlug: undefined,
  showTitle: true,
  title: Format.capitalize(Translation.t('form.label') || ''),
  hintClass: '',
  showCELogo: false,
  phoneCallback: undefined
})

const formIsSent = ref<boolean>(false)
const requestResponse = ref<ReqResp>()
const isLoading = ref<boolean>(false)
const localForm = ref<FormDataType>(props.form)
const isFormFilled = computed(() => {
  const isFilled = []
  for (const key of Object.keys(localForm.value) as Array<keyof typeof localForm.value>) {
    const field: InputFieldUnionType = localForm.value[key]
    if (field.required) {
      isFilled.push(isFieldValid(field))
    }
  }
  return isFilled.every((v) => v)
})

const isFormValid = computed(() => {
  const isValid = []
  for (const key of Object.keys(localForm.value) as Array<keyof typeof localForm.value>) {
    const field: InputFieldUnionType = localForm.value[key]
    if (field.required) {
      isValid.push(field.isValid)
    }
  }

  return isValid.every((v) => v !== false)
})

const isFieldValid = (field: InputFieldUnionType): boolean => {
  return field.value !== undefined && field.value !== '' && field.value !== false
}

const saveForm = async () => {
  try {
    isLoading.value = true
    const opportunity = new OpportunityApi(localForm.value, props.dataId, props.dataSlug || props.dataId, props.formType)
    requestResponse.value = await opportunity.fetch()
    // analytics / send event
    if (requestResponse.value.id) {
      Analytics.sendEvent(TrackId.Results, getEventName(), { opportunityId: requestResponse.value.id })
    }
  } finally {
    isLoading.value = false
    formIsSent.value = true
    scrollToFormContainer()
  }
}
const getEventName = () => {
  return `send_${props.formType}_form${navigation.isCatalogDetail() ? '_catalog' : ''}`
}
const scrollToFormContainer = () => {
  const element = props.formContainerRef
  if (element) {
    Scroll.to(element)
  }
}
</script>
