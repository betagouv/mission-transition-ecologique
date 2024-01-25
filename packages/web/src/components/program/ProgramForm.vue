<template>
  <!-- BACK TO FORM BTN -->
  <DsfrButton
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
            :model-value="formData.name.value"
            label-visible
            :required="formData.name.required"
            label="Prénom"
            @update:model-value="updateFormData($event, 'name')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <DsfrInputGroup>
          <DsfrInput
            type="text"
            :model-value="formData.surname.value"
            label-visible
            :required="formData.surname.required"
            label="Nom"
            @update:model-value="updateFormData($event, 'surname')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup>
          <DsfrInput
            type="text"
            :model-value="formData.email.value"
            label-visible
            :required="formData.email.required"
            label="Email"
            @update:model-value="updateFormData($event, 'email')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup>
          <DsfrInput
            type="text"
            :model-value="formData.tel.value"
            label-visible
            :required="formData.tel.required"
            label="Téléphone"
            @update:model-value="updateFormData($event, 'tel')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrInputGroup>
          <DsfrInput
            type="text"
            :model-value="formData.siret.value"
            label-visible
            :required="formData.siret.required"
            label="SIRET de votre entreprise"
            @update:model-value="updateFormData($event, 'siret')"
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
            :model-value="formData.needs.value"
            label-visible
            :required="formData.needs.required"
            label="Quel est votre besoin ?"
            @update:model-value="updateFormData($event, 'needs')"
          >
          </DsfrInput>
        </DsfrInputGroup>
      </div>
      <div class="fr-col-12 fr-col-md-12">
        <DsfrCheckbox
          :model-value="formData.cgu.value"
          name="cgu"
          :required="formData.cgu.required"
          @update:model-value="updateFormData($event, 'cgu')"
        >
          <template #label>
            <span> J'accepte d'être recontacté par l'équipe de Transition Écologique des Entreprises <code>*</code></span>
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
          <br />
          <br />
          Pour toute question, vous pouvez nous contacter à "france-transition(at)beta.gouv.fr"
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
        <DsfrButton
          :label="Translation.t('send')"
          :disabled="!canSaveFrom"
          icon="ri-arrow-right-line"
          icon-right
          :loading="isLoading"
          @click="saveFormData()"
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
    <div
      v-if="!hasNoRespError"
      class="fr-text-center"
    >
      <p class="tee-form-response tee-form-response-error">
        <v-icon
          name="ri-close-circle-fill"
          aria-hidden="true"
          scale="3"
        ></v-icon>
      </p>
      <h3 class="tee-form-response tee-form-response-error fr-mb-2v">
        {{ Translation.t(`form.sorryError`) }}
      </h3>
      <h3 class="tee-form-response tee-form-response-error">
        {{ Translation.t(`form.notSent`) }}
      </h3>
      <h6 class="tee-form-response-blue fr-mt-15v fr-mb-3v">
        {{ Translation.t('form.nowWhat') }}
      </h6>
      <p class="tee-form-response-blue fr-mb-15v">
        <span v-html="Translation.ti(Translation.t('form.errorMsg'), { email: contactEmail })"></span>
      </p>
    </div>

    <!-- MESSAGE IF 200 -->
    <div
      v-if="hasNoRespError"
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
// CONSOLE LOG TEMPLATE
// console.log(`TeeForm > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed, ref, toRaw } from 'vue'
import { type FormCallback, type FormOptions, type ProgramData, type ReqResp, TrackId } from '@/types'
import { sendApiRequest } from '@/utils/requests'
import { tracksStore } from '@/stores/tracks'
import Translation from '@/utils/translation'
import DsfrButton from '@/components/button/DsfrButton.vue'
import { DsfrInput, DsfrInputGroup, DsfrCheckbox } from '@gouvminint/vue-dsfr'
import Matomo from '@/utils/matomo'
import MetaEnv from '@/utils/metaEnv'
import { RouteName } from '@/types/routeType'
import { useRoute } from 'vue-router'
import Format from '@/utils/format'

const route = useRoute()
const tracks = tracksStore()

const trackValues: any[] = tracks.getAllUsedTracksValues
const contactEmail = MetaEnv.contactEmail

interface Props {
  trackId: TrackId
  formOptions: FormOptions
  program: ProgramData
  formContainerRef: HTMLElement | null | undefined
}
const props = defineProps<Props>()

export interface ContactForm {
  [key: string]: { required: boolean; value: string | undefined } | { required: boolean; value: boolean }
  name: { required: true; value: string | undefined }
  surname: { required: true; value: string | undefined }
  tel: { required: true; value: string | undefined }
  email: { required: true; value: string | undefined }
  siret: { required: true; value: string | undefined }
  needs: { required: true; value: string | undefined }
  cgu: { required: true; value: boolean }
}

const formData = ref<ContactForm>({
  name: { required: true, value: undefined },
  surname: { required: true, value: undefined },
  tel: { required: true, value: undefined },
  email: { required: true, value: undefined },
  siret: { required: true, value: tracks.findSelectedValueByTrackIdAndKey(TrackId.Siret, 'siret') },
  needs: {
    required: true,
    value: Translation.t('program.form.needs', {
      secteur: tracks.findSelectedValueByTrackIdAndKey(TrackId.Siret, 'secteur'),
      titreAide: props.program.titre
    })
  },
  cgu: { required: true, value: false }
})
const formIsSent = ref<boolean>(false)
const requestResponses = ref<ReqResp[]>()
const isLoading = ref<boolean>(false)

const canSaveFrom = computed(() => {
  const isValid = []
  for (const key in formData.value) {
    if (formData.value[key].required) {
      isValid.push(!(formData.value[key].value === undefined || formData.value[key].value === ''))
    }
  }
  return isValid.every((v) => v)
})

const hasNoRespError = computed(() => {
  return !requestResponses.value || requestResponses.value?.map((r) => r.status).every((s) => s === 200 || s === 201)
})

const findPrefix = (str: string, prefixCode: string = 'of') => {
  return Translation.t(`articles.${str}.${prefixCode}`)
}

const updateFormData = (ev: string | boolean, id: string) => {
  if (formData.value) {
    formData.value[id].value = ev
  }
}

const saveFormData = async () => {
  try {
    isLoading.value = true
    requestResponses.value = []
    const activeCallbacks = toRaw(props.formOptions.callbacks).filter((cb: FormCallback) => !cb.disabled)
    for (const callback of activeCallbacks) {
      requestResponses.value.push(await sendApiRequest(callback, formData, trackValues, { programId: props.program.id }))
    }

    // analytics / send event
    Matomo.sendEvent(props.trackId, route.name === RouteName.CatalogDetail ? 'send_form_catalog' : 'send_form')
  } finally {
    isLoading.value = false
    formIsSent.value = true
    scrollToFormContainer()
  }
}

const scrollToFormContainer = () => {
  props.formContainerRef?.scrollIntoView({ block: 'start' })
}
</script>
