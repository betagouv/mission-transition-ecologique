<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row">
      <div class="fr-h3 fr-col-12 fr-text-center">Contactez un conseiller</div>
      <div class="fr-col-12 fr-text-center">
        👋 Expliquez nous votre projet, nous vous mettrons en relation avec un conseiller compétent pour votre demande sur votre territoire.
      </div>
      <div class="fr-col-12">
        <!-- BACK TO FORM BTN -->
        <TeeDsfrButton
          v-show="formIsSent"
          class="fr-btn fr-btn--tertiary-no-outline inline-flex fr-mb-3v fr-link fr-tee-form-arrow-back"
          tertiary
          no-outline
          icon="ri-arrow-left-line"
          @click="formIsSent = !formIsSent"
        />
        <!-- FORM -->
        <div
          v-if="!formIsSent"
          class="fr-tee-form fr-m-auto fr-mt-4v"
        >
          <!-- FIELDS -->
          <div class="fr-grid-row fr-grid-row--gutters fr-mb-2v">
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInput
                :model-value="opportunityForm.project.value"
                label-visible
                :is-valid="opportunityForm.project.isValid"
                :required="opportunityForm.project.required"
                :label="opportunityForm.project.label"
                :disabled="opportunityForm.project.disabled"
              />
            </div>
            <div class="fr-col-12 fr-col-md-6">
              <DsfrInputGroup
                :error-message="getErrorMessage(opportunityForm.name)"
                :valid-message="getValidMessage(opportunityForm.name)"
              >
                <DsfrInput
                  type="text"
                  :model-value="opportunityForm.name.value"
                  label-visible
                  :is-valid="opportunityForm.name.isValid"
                  :required="opportunityForm.name.required"
                  :label="opportunityForm.name.label"
                  @update:model-value="updateOpportunityForm($event, 'name')"
                  @focusout="validateFormField(opportunityForm.name)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-6">
              <DsfrInputGroup
                :error-message="getErrorMessage(opportunityForm.surname)"
                :valid-message="getValidMessage(opportunityForm.surname)"
              >
                <DsfrInput
                  type="text"
                  :model-value="opportunityForm.surname.value"
                  label-visible
                  :is-valid="opportunityForm.surname.isValid"
                  :required="opportunityForm.surname.required"
                  :label="opportunityForm.surname.label"
                  @update:model-value="updateOpportunityForm($event, 'surname')"
                  @focusout="validateFormField(opportunityForm.surname)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInputGroup
                :error-message="getErrorMessage(opportunityForm.email)"
                :valid-message="getValidMessage(opportunityForm.email)"
              >
                <DsfrInput
                  type="email"
                  :model-value="opportunityForm.email.value"
                  label-visible
                  :is-valid="opportunityForm.email.isValid"
                  :required="opportunityForm.email.required"
                  :label="opportunityForm.email.label"
                  :hint="opportunityForm.email.hint"
                  @update:model-value="updateOpportunityForm($event, 'email')"
                  @focusout="validateFormField(opportunityForm.email)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInputGroup
                :error-message="getErrorMessage(opportunityForm.tel)"
                :valid-message="getValidMessage(opportunityForm.tel)"
              >
                <DsfrInput
                  type="tel"
                  :model-value="opportunityForm.tel.value"
                  label-visible
                  :is-valid="opportunityForm.tel.isValid"
                  :required="opportunityForm.tel.required"
                  :label="opportunityForm.tel.label"
                  :hint="opportunityForm.tel.hint"
                  @update:model-value="updateOpportunityForm($event, 'tel')"
                  @focusout="validateFormField(opportunityForm.tel)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInputGroup
                :error-message="getErrorMessage(opportunityForm.siret)"
                :valid-message="getValidMessage(opportunityForm.siret)"
              >
                <DsfrInput
                  type="text"
                  :model-value="opportunityForm.siret.value"
                  label-visible
                  :is-valid="opportunityForm.siret.isValid"
                  :required="opportunityForm.siret.required"
                  :label="opportunityForm.siret.label"
                  :hint="opportunityForm.siret.hint"
                  @update:model-value="updateOpportunityForm($event, 'siret')"
                  @focusout="validateFormField(opportunityForm.siret)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInputGroup
                :error-message="getErrorMessage(opportunityForm.needs)"
                :valid-message="getValidMessage(opportunityForm.needs)"
              >
                <DsfrInput
                  type="textarea"
                  is-textarea
                  rows="8"
                  :model-value="opportunityForm.needs.value"
                  label-visible
                  :is-valid="opportunityForm.needs.isValid"
                  :required="opportunityForm.needs.required"
                  :label="opportunityForm.needs.label"
                  @update:model-value="updateOpportunityForm($event, 'needs')"
                  @focusout="validateFormField(opportunityForm.needs)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrCheckbox
                :model-value="opportunityForm.cgu.value"
                name="cgu"
                :is-valid="opportunityForm.cgu.isValid"
                :required="opportunityForm.cgu.required"
                @update:model-value="updateOpportunityForm($event, 'cgu')"
                @focusout="validateFormField(opportunityForm.cgu)"
              >
                <template #label>
                  <span> {{ opportunityForm.cgu.label }} <code>*</code></span>
                </template>
              </DsfrCheckbox>

              <!-- CHECKBOX HINT -->
              <span class="fr-hint-text fr-mt-5v">
                Vos données à caractère personnel seront uniquement utilisées à des fins légitimes et nécessaires par l'équipe de Transition
                Écologique des Entreprises dans le respect du RGPD, c'est-à-dire pour vous recontacter par email ou par téléphone afin de
                vous aider à vous orienter et à vous conseiller dans votre recherche d'aides à la transition écologique de votre entreprise.
                Voir également nos
                <a
                  href="https://mission-transition-ecologique.beta.gouv.fr/donnees-personnelles"
                  target="_blank"
                >
                  Conditions Générales d'Utilisation </a
                >.
              </span>
            </div>
          </div>

          <!-- FORM HELPER -->
          <h6
            class="fr-mb-0"
            style="font-size: 0.7em"
          >
            <code>*</code>
            &nbsp;
            {{ Translation.t('form.mandatory') }}
          </h6>

          <!-- SEND / NEXT BUTTON -->
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mt-5v">
            <div
              class="fr-col-12"
              style="display: grid; justify-content: right"
            >
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
          class="fr-mt-5v fr-tee-form"
        >
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
              ></v-icon>
            </p>
            <h3 class="tee-form-response tee-form-response-blue">
              {{ Translation.t(`form.sent`) }}
            </h3>
            <h6 class="fr-mt-15v fr-mb-3v">
              {{ Translation.t('form.nowWhat') }}
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { scrollToElementCenter } from '@/utils/helpers'
import TrackStructure from '@/utils/track/trackStructure'
import { computed, ref } from 'vue'
import { InputFieldUnionType, isValidatedStringFieldInputType, type ReqResp, TrackId } from '@/types'
import Translation from '@/utils/translation'
import TeeDsfrButton from '@/components/element/button/TeeDsfrButton.vue'
import { DsfrInput, DsfrInputGroup, DsfrCheckbox } from '@gouvminint/vue-dsfr'
import Matomo from '@/utils/matomo'
import { RouteName } from '@/types/routeType'
import { useRoute } from 'vue-router'
import OpportunityApi from '@/service/api/opportunityApi'
import type { ProjectFormType } from '@/types/opportunityFormType'
import Contact from '@/utils/contact'
import PhoneValidator from '@tee/common/src/establishment/validator/phoneValidator'
import EmailValidator from '@tee/common/src/establishment/validator/emailValidator'
import SiretValidator from '@tee/common/src/establishment/validator/siretValidator'
import { Project } from '@tee/common/src/project/types'

const route = useRoute()

interface Props {
  project: Project | undefined
  formContainerRef: HTMLElement | null | undefined
}

const props = defineProps<Props>()
const opportunityForm = ref<ProjectFormType>({
  project: { required: true, value: props.project?.title, label: 'Quel est votre projet?', disabled: true, isValid: true },
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
    value: Translation.t('project.form.needs', {
      secteur: TrackStructure.getSector()
    }),
    label: 'Quel est votre besoin ?'
  },
  cgu: {
    required: true,
    isValid: undefined,
    value: false,
    label: "J'accepte d'être recontacté par l'équipe de Transition Écologique des Entreprises"
  },
  linkToProjectPage: {
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
      Translation.t('form.errorEmail.subject', { project: props.project.title }),
      `${needsValue}

${nameValue} ${surnameValue}
${telValue}
SIRET : ${siretValue}`
    )
  }

  return ''
}

const updateOpportunityForm = (ev: string | boolean, id: string) => {
  if (opportunityForm.value) {
    opportunityForm.value[id].value = ev
  }
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
    const opportunity = new OpportunityApi(opportunityForm.value, props.project.id)
    requestResponse.value = await opportunity.fetch()

    // analytics / send event
    Matomo.sendEvent(TrackId.Results, route.name === RouteName.CatalogDetail ? 'send_form_catalog' : 'send_form')
  } finally {
    isLoading.value = false
    formIsSent.value = true
    scrollToFormContainer()
  }
}

const scrollToFormContainer = () => {
  const element = props.formContainerRef
  if (element) {
    scrollToElementCenter(element)
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
<style scoped lang="scss">
@import 'src/assets/scss/input.scss';
</style>
