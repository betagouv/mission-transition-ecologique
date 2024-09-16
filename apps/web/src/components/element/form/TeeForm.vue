<template>
  <!-- BACK TO FORM BTN -->
  <TeeDsfrButton
    v-show="formIsSent"
    class="fr-btn fr-btn--tertiary-no-outline inline-flex fr-mb-3v fr-link fr-tee-form-arrow-back"
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
        <slot name="customFields"></slot>
        <TeeFormElement
          type="text"
          :size="6"
          :field="form.name"
          @update-field="(field) => (form.name = field)"
        />
        <TeeFormElement
          type="text"
          :size="6"
          :field="form.surname"
          @update-field="(field) => (form.surname = field)"
        />
        <TeeFormElement
          type="email"
          :field="form.email"
          @update-field="(field) => (form.email = field as ValidatedStringFieldInputType)"
        />
        <TeeFormElement
          type="tel"
          :field="form.tel"
          @update-field="(field) => (form.tel = field as ValidatedStringFieldInputType)"
        />
        <TeeFormElement
          type="text"
          :field="form.siret"
          @update-field="(field) => (form.siret = field as ValidatedStringFieldInputType)"
        />
        <TeeFormElement
          type="textarea"
          :rows="10"
          :field="form.needs"
          :is-textarea="true"
          :wrapper-class="'fr-m-0'"
          @update-field="(field) => (form.needs = field)"
        >
          <template
            v-if="form.needs.callOut"
            #label
          >
            {{ form.needs.label }}
            <slot name="required-tip">
              <span
                v-if="form.needs.required"
                class="required"
                >*</span
              >
            </slot>

            <TeeCallout
              class="fr-bg--blue fr-text--white fr-px-2v fr-pt-2v fr-pb-0 fr-mb-0 fr-text--bold"
              :type="form.needs.callOut.type"
              :img="`${publicPath}${form.needs.callOut.img}`"
              :img-container-class="'fr-col-xl-2 fr-hidden fr-unhidden-lg'"
              :content-class="'fr-pb-2v fr-tee-form-banner fr-px-3v fr-px-lg-0'"
            >
              {{ form.needs.callOut.content }}
            </TeeCallout>
          </template>
        </TeeFormElement>
        <TeeFormCgu
          :field="form.cgu"
          @update-field="(field) => (form.cgu = field)"
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
    :opportunity-form="form"
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
import { InputFieldUnionType, type ReqResp, TrackId, ValidatedStringFieldInputType, CustomFormType, FormDataType } from '@/types'
import Translation from '@/utils/translation'
import TeeDsfrButton from '@/components/element/button/TeeDsfrButton.vue'
import Matomo from '@/utils/matomo'
import { useRoute } from 'vue-router'
import Format from '@/utils/format'
import OpportunityApi from '@/service/api/opportunityApi'
import { FormType, PhoneValidator, EmailValidator, SiretValidator } from '@tee/common'
import Config from '@/config'
import TrackStructure from '@/utils/track/trackStructure'
import { CalloutType } from '@/types/elementsPropsTypes'
import { useNavigationStore } from '@/stores/navigation'

const route = useRoute()
const publicPath = Config.publicPath !== 'undefined/' ? Config.publicPath : '../../public/'
const navigation = useNavigationStore()
interface Props {
  customFields?: CustomFormType
  dataId: string
  dataSlug: string
  formType: FormType
  hint: string
  errorEmailSubject: string
  need: string
  phoneCallback?: string
  formContainerRef: HTMLElement | null | undefined
}

const props = defineProps<Props>()

const form = ref<FormDataType>({
  name: { required: true, value: undefined, label: 'Prénom', isValid: undefined },
  surname: { required: true, value: undefined, label: 'Nom', isValid: undefined },
  tel: {
    required: true,
    isValid: undefined,
    value: undefined,
    label: 'Téléphone',
    hint: 'Format attendu : 01 22 33 44 55',
    validation: PhoneValidator.validate,
    errorMessage: "Le numéro de téléphone n'est pas valide."
  },
  email: {
    required: true,
    isValid: undefined,
    value: undefined,
    label: 'Email',
    hint: 'Format attendu : nom@domaine.fr',
    validation: EmailValidator.validate,
    errorMessage: "L'adresse email n'est pas valide."
  },
  siret: {
    required: true,
    isValid: undefined,
    value: TrackStructure.getSiret(),
    label: 'SIRET de votre entreprise',
    hint: 'Format attendu : 14 chiffres',
    validation: SiretValidator.validate,
    errorMessage: "Le numéro SIRET n'est pas valide."
  },
  needs: {
    required: true,
    isValid: undefined,
    value: props.need,
    label: 'Quel est votre besoin ?',
    hint: undefined,
    callOut: {
      type: CalloutType.FormInput,
      content:
        "Pour vous aider au mieux, nos conseillers ont besoin d'éléments de contexte.\n" +
        'N’hésitez pas à nous détailler votre projet, vos besoins ou vos questionnements.',
      img: 'images/TEE-conseiller.svg'
    }
  },
  cgu: {
    required: true,
    isValid: undefined,
    value: false,
    label: "J'accepte d'être recontacté par l'équipe de Transition Écologique des Entreprises"
  },
  linkToPage: {
    required: true,
    isValid: undefined,
    value: new URL(route.fullPath, window.location.origin).href
  }
})
const formIsSent = ref<boolean>(false)
const requestResponse = ref<ReqResp>()
const isLoading = ref<boolean>(false)

const isFormFilled = computed(() => {
  const isFilled = []
  for (const key in form.value) {
    if (form.value[key].required) {
      isFilled.push(isFieldValid(form.value[key]))
    }
  }
  return isFilled.every((v) => v)
})

const isFormValid = computed(() => {
  const isValid = []
  for (const key in form.value) {
    if (form.value[key].required) {
      isValid.push(form.value[key].isValid)
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
    const fullForm: FormDataType = { ...form.value, ...props.customFields }
    const opportunity = new OpportunityApi(fullForm, props.dataId, props.dataSlug, props.formType)
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
