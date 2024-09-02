<template>
  <div
    ref="teeForm"
    class="fr-grid-row fr-px-md-4w"
  >
    <div v-if="!formIsSent">
      <div
        id="project-form-title"
        class="fr-h3 fr-col-12 fr-text-center"
      >
        Contactez un conseiller
      </div>
      <div class="fr-col-12 fr-text-center">
        👋 Expliquez nous votre projet, nous vous mettrons en relation avec un conseiller compétent pour votre demande sur votre territoire.
      </div>
      <div class="fr-col-12">
        <!-- FORM -->
        <div
          v-if="!formIsSent"
          class="fr-tee-form fr-mt-4v"
        >
          <!-- FIELDS -->
          <div class="fr-grid-row fr-grid-row--gutters fr-mb-2v">
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInputGroup
                :error-message="getErrorMessage(projectForm.project)"
                :valid-message="getValidMessage(projectForm.project)"
              >
                <DsfrInput
                  v-model="projectForm.project.value"
                  type="text"
                  label-visible
                  :is-valid="projectForm.project.isValid"
                  :required="projectForm.project.required"
                  :label="projectForm.project.label"
                  @focusout="validateFormField(projectForm.project)"
                />
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-6">
              <DsfrInputGroup
                :error-message="getErrorMessage(projectForm.name)"
                :valid-message="getValidMessage(projectForm.name)"
              >
                <DsfrInput
                  v-model="projectForm.name.value"
                  type="text"
                  label-visible
                  :is-valid="projectForm.name.isValid"
                  :required="projectForm.name.required"
                  :label="projectForm.name.label"
                  @focusout="validateFormField(projectForm.name)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-6">
              <DsfrInputGroup
                :error-message="getErrorMessage(projectForm.surname)"
                :valid-message="getValidMessage(projectForm.surname)"
              >
                <DsfrInput
                  v-model="projectForm.surname.value"
                  type="text"
                  label-visible
                  :is-valid="projectForm.surname.isValid"
                  :required="projectForm.surname.required"
                  :label="projectForm.surname.label"
                  @focusout="validateFormField(projectForm.surname)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInputGroup
                :error-message="getErrorMessage(projectForm.email)"
                :valid-message="getValidMessage(projectForm.email)"
              >
                <DsfrInput
                  v-model="projectForm.email.value"
                  type="email"
                  label-visible
                  :is-valid="projectForm.email.isValid"
                  :required="projectForm.email.required"
                  :label="projectForm.email.label"
                  :hint="projectForm.email.hint"
                  @focusout="validateFormField(projectForm.email)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInputGroup
                :error-message="getErrorMessage(projectForm.tel)"
                :valid-message="getValidMessage(projectForm.tel)"
              >
                <DsfrInput
                  v-model="projectForm.tel.value"
                  type="tel"
                  label-visible
                  :is-valid="projectForm.tel.isValid"
                  :required="projectForm.tel.required"
                  :label="projectForm.tel.label"
                  :hint="projectForm.tel.hint"
                  @focusout="validateFormField(projectForm.tel)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInputGroup
                :error-message="getErrorMessage(projectForm.siret)"
                :valid-message="getValidMessage(projectForm.siret)"
              >
                <DsfrInput
                  v-model="projectForm.siret.value"
                  type="text"
                  label-visible
                  :is-valid="projectForm.siret.isValid"
                  :required="projectForm.siret.required"
                  :label="projectForm.siret.label"
                  :hint="projectForm.siret.hint"
                  @focusout="validateFormField(projectForm.siret)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrInputGroup
                :error-message="getErrorMessage(projectForm.needs)"
                :valid-message="getValidMessage(projectForm.needs)"
              >
                <DsfrInput
                  v-model="projectForm.needs.value"
                  type="textarea"
                  is-textarea
                  rows="8"
                  label-visible
                  :is-valid="projectForm.needs.isValid"
                  :required="projectForm.needs.required"
                  :label="projectForm.needs.label"
                  @focusout="validateFormField(projectForm.needs)"
                >
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12 fr-col-md-12">
              <DsfrCheckbox
                v-model="projectForm.cgu.value"
                name="cgu"
                :is-valid="projectForm.cgu.isValid"
                :required="projectForm.cgu.required"
                @focusout="validateFormField(projectForm.cgu)"
              >
                <template #label>
                  <span> {{ projectForm.cgu.label }} <code>*</code></span>
                </template>
              </DsfrCheckbox>

              <!-- CHECKBOX HINT -->
              <span class="fr-hint-text fr-mt-5v">
                Vos données à caractère personnel seront uniquement utilisées à des fins légitimes et nécessaires par l'équipe de Transition
                Écologique des Entreprises dans le respect du RGPD, c'est-à-dire pour vous recontacter par email ou par téléphone afin de
                vous aider à vous orienter et à vous conseiller dans votre recherche d'aides à la transition écologique de votre entreprise.
                Voir également nos
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
          <div class="fr-grid-row fr-grid-row--gutters fr-mt-5v">
            <div class="fr-col-12 fr-col-justify--right">
              <TeeDsfrButton
                :label="Translation.t('send')"
                :disabled="!isFormFilled || !isFormValid"
                icon="ri-arrow-right-line"
                icon-right
                :loading="isLoading"
                @click="saveProjectForm()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="fr-col-12 fr-text-center"
    >
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OpportunityApi from '@/service/api/opportunityApi'
import {
  InputFieldUnionType,
  isValidatedStringFieldInputType,
  OpportunityType,
  Project,
  ProjectFormType,
  type ReqResp,
  PhoneValidator,
  EmailValidator,
  SiretValidator,
  TrackId,
  RouteName
} from '@/types'
import Matomo from '@/utils/matomo'
import { Scroll } from '@/utils/scroll'
import TrackStructure from '@/utils/track/trackStructure'
import Translation from '@/utils/translation'
import { DsfrCheckbox, DsfrInput, DsfrInputGroup } from '@gouvminint/vue-dsfr'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Contact from '@/utils/contact'

const route = useRoute()

interface Props {
  project: Project
}

const props = defineProps<Props>()
const teeForm = ref<HTMLElement | null | undefined>(null)

const projectForm = ref<ProjectFormType>({
  project: { required: true, value: props.project.title, label: 'Quel est votre projet?', isValid: true },
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
      secteur: TrackStructure.getSectorShortLabel()
    }),
    label: 'Quel est votre besoin ?'
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
  for (const key in projectForm.value) {
    if (projectForm.value[key].required) {
      isFilled.push(isFieldValid(projectForm.value[key]))
    }
  }
  return isFilled.every((v) => v)
})

const isFormValid = computed(() => {
  const isValid = []
  for (const key in projectForm.value) {
    if (projectForm.value[key].required) {
      isValid.push(projectForm.value[key].isValid)
    }
  }
  return isValid.every((v) => v !== false)
})

const hasValidResponse = computed(() => {
  return !requestResponse.value || requestResponse.value.status === 200 || requestResponse.value.status === 201
})

const getMailTo = (): string => {
  if (projectForm.value) {
    const needsValue = projectForm.value.needs.value ? projectForm.value.needs.value : ''
    const nameValue = projectForm.value.name.value ? projectForm.value.name.value : ''
    const surnameValue = projectForm.value.surname.value ? projectForm.value.surname.value : ''
    const telValue = projectForm.value.tel.value ? projectForm.value.tel.value : ''
    const siretValue = projectForm.value.siret.value ? projectForm.value.siret.value : ''
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

const saveProjectForm = async () => {
  try {
    isLoading.value = true
    const opportunity = new OpportunityApi(projectForm.value, props.project.id.toString(), props.project.slug, OpportunityType.Project)
    requestResponse.value = await opportunity.fetch()

    // analytics / send event
    Matomo.sendEvent(TrackId.Results, 'send_project_form')
  } finally {
    isLoading.value = false
    formIsSent.value = true
    scrollToFormContainer()
  }
}

const scrollToFormContainer = () => {
  if (teeForm.value) {
    Scroll.to(teeForm.value)
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
