<template>
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
    class="fr-tee-form fr-my-4v"
  >
    <!-- FORM LABEL -->
    <h3 class="fr-text-center">
      {{
        Format.capitalize(
          Translation.t('program.form.label', {
            prefixAide: findPrefix(program["nature de l'aide"], 'this'),
            natureAide: program["nature de l'aide"]
          }) || ''
        )
      }}
    </h3>
    <!-- FORM HINT -->
    <p class="fr-text-center fr-pb-10v">
      {{ Translation.t('program.form.hint', { operator: program['opérateur de contact'] }) }}
    </p>

    <!-- FIELDS -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-2v">
      <div class="fr-col-12 fr-col-md-6">
        <DsfrInputGroup>
          <DsfrInput
            type="text"
            :model-value="opportunityForm.name.value"
            label-visible
            :required="opportunityForm.name.required"
            :label="opportunityForm.name.label"
            @update:model-value="updateOpportunityForm($event, 'name')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <DsfrInputGroup>
          <DsfrInput
            type="text"
            :model-value="opportunityForm.surname.value"
            label-visible
            :required="opportunityForm.surname.required"
            :label="opportunityForm.surname.label"
            @update:model-value="updateOpportunityForm($event, 'surname')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup>
          <DsfrInput
            type="email"
            :model-value="opportunityForm.email.value"
            label-visible
            :required="opportunityForm.email.required"
            :label="opportunityForm.email.label"
            @update:model-value="updateOpportunityForm($event, 'email')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup>
          <DsfrInput
            type="tel"
            :model-value="opportunityForm.tel.value"
            label-visible
            :required="opportunityForm.tel.required"
            :label="opportunityForm.tel.label"
            @update:model-value="updateOpportunityForm($event, 'tel')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup>
          <DsfrInput
            type="text"
            :model-value="opportunityForm.siret.value"
            label-visible
            :required="opportunityForm.siret.required"
            :label="opportunityForm.siret.label"
            :hint="opportunityForm.siret.hint"
            @update:model-value="updateOpportunityForm($event, 'siret')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup>
          <DsfrInput
            type="textarea"
            is-textarea
            rows="8"
            :model-value="opportunityForm.needs.value"
            label-visible
            :required="opportunityForm.needs.required"
            :label="opportunityForm.needs.label"
            @update:model-value="updateOpportunityForm($event, 'needs')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrCheckbox
          :model-value="opportunityForm.cgu.value"
          name="cgu"
          :required="opportunityForm.cgu.required"
          @update:model-value="updateOpportunityForm($event, 'cgu')"
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
          :disabled="!isValidForm"
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
      <p class="fr-mb-15v">
        <span>
          {{ Translation.ti(Translation.t('form.phoneContact'), { operator: program['opérateur de contact'] }) }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { scrollToElementCenter } from '@/utils/helpers'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { computed, ref } from 'vue'
import { type ProgramData, type ReqResp, TrackId } from '@/types'
import Translation from '@/utils/translation'
import TeeDsfrButton from '@/components/element/TeeDsfrButton.vue'
import { DsfrInput, DsfrInputGroup, DsfrCheckbox } from '@gouvminint/vue-dsfr'
import Matomo from '@/utils/matomo'
import { RouteName } from '@/types/routeType'
import { useRoute } from 'vue-router'
import Format from '@/utils/format'
import OpportunityApi from '@/service/api/opportunityApi'
import type { opportunityFormType } from '@/types/opportunityFormType'
import Contact from '@/utils/contact'

const route = useRoute()
const usedTrack = useUsedTrackStore()

interface Props {
  program: ProgramData
  formContainerRef: HTMLElement | null | undefined
}
const props = defineProps<Props>()

const opportunityForm = ref<opportunityFormType>({
  name: { required: true, value: undefined, label: 'Prénom', hint: undefined },
  surname: { required: true, value: undefined, label: 'Nom', hint: undefined },
  tel: { required: true, value: undefined, label: 'Téléphone', hint: undefined },
  email: { required: true, value: undefined, label: 'Email', hint: undefined },
  siret: {
    required: true,
    value: usedTrack.findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'siret'),
    label: 'SIRET de votre entreprise',
    hint: 'Format attendu: 14 chiffres'
  },
  needs: {
    required: true,
    value: Translation.t('program.form.needs', {
      secteur:
        usedTrack.findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'secteur') ??
        usedTrack.findInQuestionnaireDataByTrackIdAndKey(TrackId.Sectors, 'sector'),
      titreAide: props.program.titre
    }),
    label: 'Quel est votre besoin ?',
    hint: undefined
  },
  cgu: {
    required: true,
    value: false,
    label: "J'accepte d'être recontacté par l'équipe de Transition Écologique des Entreprises",
    hint: undefined
  },
  linkToProgramPage: {
    required: true,
    value: new URL(route.fullPath, window.location.origin).href,
    label: undefined,
    hint: undefined
  }
})
const formIsSent = ref<boolean>(false)
const requestResponse = ref<ReqResp>()
const isLoading = ref<boolean>(false)

const isValidForm = computed(() => {
  const isValid = []
  for (const key in opportunityForm.value) {
    if (opportunityForm.value[key].required) {
      isValid.push(
        !(
          opportunityForm.value[key].value === undefined ||
          opportunityForm.value[key].value === '' ||
          opportunityForm.value[key].value === false
        )
      )
    }
  }
  return isValid.every((v) => v)
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

const findPrefix = (str: string, prefixCode: string = 'of') => {
  return Translation.t(`articles.${str}.${prefixCode}`)
}

const updateOpportunityForm = (ev: string | boolean, id: string) => {
  if (opportunityForm.value) {
    opportunityForm.value[id].value = ev
  }
}

const saveOpportunityForm = async () => {
  try {
    isLoading.value = true
    const opportunity = new OpportunityApi(opportunityForm.value, props.program.id)
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
</script>
