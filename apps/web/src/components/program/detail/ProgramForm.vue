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
    class="fr-tee-form-container fr-my-4v"
  >
    <!-- FORM LABEL -->
    <h3 class="fr-text-center">
      {{ Format.capitalize(Translation.t('program.form.label') || '') }}
    </h3>
    <!-- FORM HINT -->
    <p class="fr-text-center fr-pb-10v">
      {{ Translation.t('program.form.hint', { operator: program['opérateur de contact'] }) }}
    </p>

    <!-- FIELDS -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-2v">
      <div class="fr-col-12 fr-col-md-6">
        <DsfrInputGroup
          :error-message="getErrorMessage(opportunityForm.name)"
          :valid-message="getValidMessage(opportunityForm.name)"
        >
          <DsfrInput
            v-model="opportunityForm.name.value"
            type="text"
            label-visible
            :is-valid="opportunityForm.name.isValid"
            :required="opportunityForm.name.required"
            :label="opportunityForm.name.label"
            @focusout="validateFormField(opportunityForm.name)"
          />
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <DsfrInputGroup
          :error-message="getErrorMessage(opportunityForm.surname)"
          :valid-message="getValidMessage(opportunityForm.surname)"
        >
          <DsfrInput
            v-model="opportunityForm.surname.value"
            type="text"
            label-visible
            :is-valid="opportunityForm.surname.isValid"
            :required="opportunityForm.surname.required"
            :label="opportunityForm.surname.label"
            @focusout="validateFormField(opportunityForm.surname)"
          />
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup
          :error-message="getErrorMessage(opportunityForm.email)"
          :valid-message="getValidMessage(opportunityForm.email)"
        >
          <DsfrInput
            v-model="opportunityForm.email.value"
            type="email"
            label-visible
            :is-valid="opportunityForm.email.isValid"
            :required="opportunityForm.email.required"
            :label="opportunityForm.email.label"
            :hint="opportunityForm.email.hint"
            @focusout="validateFormField(opportunityForm.email)"
          />
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup
          :error-message="getErrorMessage(opportunityForm.tel)"
          :valid-message="getValidMessage(opportunityForm.tel)"
        >
          <DsfrInput
            v-model="opportunityForm.tel.value"
            type="tel"
            label-visible
            :is-valid="opportunityForm.tel.isValid"
            :required="opportunityForm.tel.required"
            :label="opportunityForm.tel.label"
            :hint="opportunityForm.tel.hint"
            @focusout="validateFormField(opportunityForm.tel)"
          />
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup
          :error-message="getErrorMessage(opportunityForm.siret)"
          :valid-message="getValidMessage(opportunityForm.siret)"
        >
          <DsfrInput
            v-model="opportunityForm.siret.value"
            type="text"
            label-visible
            :is-valid="opportunityForm.siret.isValid"
            :required="opportunityForm.siret.required"
            :label="opportunityForm.siret.label"
            :hint="opportunityForm.siret.hint"
            @focusout="validateFormField(opportunityForm.siret)"
          />
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup
          :error-message="getErrorMessage(opportunityForm.needs)"
          :valid-message="getValidMessage(opportunityForm.needs)"
        >
          <DsfrInput
            v-model="opportunityForm.needs.value"
            type="textarea"
            is-textarea
            rows="10"
            label-visible
            :is-valid="opportunityForm.needs.isValid"
            :required="opportunityForm.needs.required"
            :label="opportunityForm.needs.label"
            :wrapper-class="'fr-m-0'"
            @focusout="validateFormField(opportunityForm.needs)"
          >
            <template
              v-if="opportunityForm.needs.callOut"
              #label
            >
              {{ opportunityForm.needs.label }}
              <slot name="required-tip">
                <span
                  v-if="opportunityForm.needs.required"
                  class="required"
                  >*</span
                >
              </slot>

              <TeeCallout
                class="fr-bg--blue fr-text--white fr-px-2v fr-pt-2v fr-pb-0 fr-mb-0 fr-text--bold"
                :type="opportunityForm.needs.callOut.type"
                :img="`${publicPath}${opportunityForm.needs.callOut.img}`"
                :img-container-class="'fr-col-xl-2 fr-hidden fr-unhidden-lg'"
                :content-class="'fr-pb-2v fr-tee-form-banner fr-px-3v fr-px-lg-0'"
              >
                {{ opportunityForm.needs.callOut.content }}
              </TeeCallout>
            </template>
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrCheckbox
          v-model="opportunityForm.cgu.value"
          name="cgu"
          :is-valid="opportunityForm.cgu.isValid"
          :required="opportunityForm.cgu.required"
          @focusout="validateFormField(opportunityForm.cgu)"
        >
          <template #label>
            <span> {{ opportunityForm.cgu.label }} <code>*</code></span>
          </template>
        </DsfrCheckbox>

        <!-- CHECKBOX HINT -->
        <span class="fr-hint-text fr-mt-5v">
          Vos données à caractère personnel seront uniquement utilisées à des fins légitimes et nécessaires par l'équipe de Transition
          Écologique des Entreprises dans le respect du RGPD, c'est-à-dire pour vous recontacter par email ou par téléphone afin de vous
          aider à vous orienter et à vous conseiller dans votre recherche d'aides à la transition écologique de votre entreprise. Voir
          également nos
          <router-link
            :to="{ name: RouteName.PersonalData }"
            target="_blank"
          >
            Conditions Générales d'Utilisation
          </router-link>
          .
        </span>
      </div>
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
          :disabled="!isFormFilled"
          icon="ri-arrow-right-line"
          icon-right
          :loading="isLoading"
          @click="saveOpportunityForm()"
        />
      </div>
    </div>
  </div>

  <!-- FORM CALLBACK -->
  <div
    v-if="formIsSent"
    class="fr-mt-5v fr-grid-row fr-grid-row--center fr-grid-row--middle"
  >
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
        <p class="fr-mb-15v">
          <span>
            {{ Translation.ti(Translation.t('form.phoneContact'), { operator: program['opérateur de contact'] }) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Scroll } from '@/utils/scroll'
import TrackStructure from '@/utils/track/trackStructure'
import { computed, ref } from 'vue'
import { InputFieldUnionType, isValidatedStringFieldInputType, type ProgramData, type ReqResp, TrackId } from '@/types'
import Translation from '@/utils/translation'
import TeeDsfrButton from '@/components/element/button/TeeDsfrButton.vue'
import { DsfrInput, DsfrInputGroup, DsfrCheckbox } from '@gouvminint/vue-dsfr'
import Matomo from '@/utils/matomo'
import { RouteName } from '@/types/routeType'
import { useRoute } from 'vue-router'
import Format from '@/utils/format'
import OpportunityApi from '@/service/api/opportunityApi'
import { OpportunityFormType } from '@/types'
import Contact from '@/utils/contact'
import { OpportunityType, PhoneValidator, EmailValidator, SiretValidator } from '@tee/common'
import Config from '@/config'
import { CalloutType } from '@/types/elementsPropsTypes'

const route = useRoute()
const publicPath = Config.publicPath !== 'undefined/' ? Config.publicPath : '../../public/'

interface Props {
  program: ProgramData
  formContainerRef: HTMLElement | null | undefined
}

const props = defineProps<Props>()

const opportunityForm = ref<OpportunityFormType>({
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
    value: Translation.t('program.form.needs', {
      secteur: TrackStructure.getSector(),
      titreAide: props.program.titre
    }),
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
  for (const key in opportunityForm.value) {
    if (opportunityForm.value[key].required) {
      isFilled.push(isFieldValid(opportunityForm.value[key]))
    }
  }
  return isFilled.every((v) => v)
})

const hasValidResponse = computed(() => {
  return !requestResponse.value || requestResponse.value.status === 200 || requestResponse.value.status === 201
})

const getMailTo = (): string => {
  if (opportunityForm.value) {
    const needsValue = opportunityForm.value.needs.value ? opportunityForm.value.needs.value : ''
    const nameValue = opportunityForm.value.name.value ? opportunityForm.value.name.value : ''
    const surnameValue = opportunityForm.value.surname.value ? opportunityForm.value.surname.value : ''
    const telValue = opportunityForm.value.tel.value ? opportunityForm.value.tel.value : ''
    const siretValue = opportunityForm.value.siret.value ? opportunityForm.value.siret.value : ''
    return Contact.getMailtoUrl(
      Translation.t('form.errorEmail.subject', { program: props.program.titre }),
      `${needsValue}

${nameValue} ${surnameValue}
${telValue}
SIRET : ${siretValue}`
    )
  }

  return ''
}

const isFieldValid = (field: InputFieldUnionType): boolean => {
  return field.value !== undefined && field.value !== '' && field.value !== false
}

const validateFormField = (field: InputFieldUnionType): void => {
  if (isValidatedStringFieldInputType(field)) {
    field.isValid = field.validation(field.value, !!field.label?.includes('SIRET')) as boolean
  } else {
    field.isValid = isFieldValid(field)
  }
}

const saveOpportunityForm = async () => {
  try {
    isLoading.value = true
    const opportunity = new OpportunityApi(opportunityForm.value, props.program.id, OpportunityType.Program)
    requestResponse.value = await opportunity.fetch()

    // analytics / send event
    Matomo.sendEvent(TrackId.Results, route.name === RouteName.CatalogProgramDetail ? 'send_form_catalog' : 'send_form')
  } finally {
    isLoading.value = false
    formIsSent.value = true
    scrollToFormContainer()
  }
}

const scrollToFormContainer = () => {
  const element = props.formContainerRef
  if (element) {
    Scroll.toBlockCenter(element)
  }
}

const getErrorMessage = (field: InputFieldUnionType): string => {
  if (!isValidatedStringFieldInputType(field) || !isFieldValid(field)) {
    return field.isValid === false ? 'Ce champ est obligatoire.' : ''
  }
  return field.isValid === false ? field.errorMessage : ''
}

const getValidMessage = (field: InputFieldUnionType): string => {
  return field.isValid === true ? ' ' : ''
}
</script>
