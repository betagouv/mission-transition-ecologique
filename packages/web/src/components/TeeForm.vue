<template>
  <!-- FORM -->
  <div
    class="fr-tee-form"
    v-show="!formIsSent">

    <!-- DEBUGGING -->
    <div
      v-if="debug"
      class="vue-debug">
      <p>
        requiredFields:
        <code>
          {{ requiredFields }}
        </code>
      </p>
      <p>
        canSaveFrom:
        <code>
          {{ canSaveFrom }}
        </code>
      </p>
    </div>

    <!-- FORM LABEL -->
    <h3
      v-if="formOptions.label"
      class="fr-text-center">
      <!-- {{ formOptions.label[choices.lang] }} -->
      {{ capitalizeFirstLetter(choices.ti(formOptions.label[choices.lang], { 'prefixAide': findPrefix(program["nature de l'aide"], 'this'), 'natureAide': program["nature de l'aide"] }) || '') }}
    </h3>

    <!-- FORM LABEL -->
    <p
      v-if="formOptions.hint"
      class="fr-text-center fr-pb-10v">
      <!-- {{ formOptions.hint[choices.lang] }} -->
      {{ choices.ti(formOptions.hint[choices.lang], {'operator': program['opérateur de contact']}) }}
    </p>

    <!-- {{ program }} -->

    <!-- FIELDS -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-2v">

      <div
        v-for="field in formOptions.fields"
        :key="field.id"
        :class="`fr-col-12 fr-col-md-${ field.cols ? field.cols : 12 }`"
        >
        <!-- DEBUGGING -->
        <div
          v-if="debug"
          class="vue-debug">
          Field.id:
          <code>
            {{ field.id }}
          </code >
          --- field.type :
          <code >
            {{ field.type }}
          </code>
          --- formData[field.id] :
          <code >
            {{ formData[field.id] }}
          </code>
        </div>

        <!-- INPUT GROUP -->
        <DsfrInputGroup
          v-if="!isCheckbox(field)">
          <DsfrInput
            :type="field.type"
            :is-textarea="isTextarea(field)"
            :rows="isTextarea(field) && (field.rows || 4)"
            :model-value="formData[field.id]"
            label-visible
            :required="field.required"
            :label="field?.label?.[choices.lang]"
            :placeholder="(field.hint && field.hint[choices.lang]) || ''"
            @update:modelValue="updateFormData($event, field.id)"
            >
          </DsfrInput>
        </DsfrInputGroup>

        <!-- CHECKBOXES -->
        <DsfrCheckbox
          v-if="isCheckbox(field)"
          :model-value="formData[field.id]"
          :name="field.id"
          :required="field.required"
          @update:modelValue="updateFormData($event, field.id)">
          <!-- :hint="field.hint[choices.lang]" -->
          <template #label>
            <span>
              {{ field?.label?.[choices.lang] }}
            </span>
          </template>
        </DsfrCheckbox>

        <!-- CHECKBOX HINT -->
        <div v-if="isCheckbox(field)">
          <span
            class="fr-hint-text fr-mt-5v"
            v-html="field.hint?.[choices.lang] || ''">
          </span>
        </div>
      </div>

    </div>

    <!-- FORM HELPER -->
    <h6
      class="fr-mb-0"
      style="font-size: 0.7em;">
      <code>*</code>
      &nbsp;
      {{ choices.t('form.mandatory')}}
    </h6>

    <!-- SEND / NEXT BUTTON -->
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mt-5v">
      <div
        class="fr-col-12"
        style="display: grid; justify-content: right;">
        <!-- :label="choices.t('next')"  -->
        <DsfrButton
          :label="choices.t('send')"
          :disabled="!canSaveFrom"
          icon="ri-arrow-right-line"
          icon-right
          @click="saveFormData()"
          :loading='isLoading'
        />
      </div>
    </div>
  </div>

  <!-- FORM CALLBACK -->
  <div
    v-if="formIsSent"
    class="fr-mt-5v fr-tee-form">
    <!-- FORM ALERT AFTER SENDING-->
    <div
      v-if="!hasNoRespError"
      class="fr-alert fr-alert--error fr-tee-form-error">
      <div
        class="fr-alert__title">
        <p>
          {{ choices.t(`form.notSent`) }}
        </p>
        <p>
          <code
            v-for="(resp, idx) in requestResponses"
            :key="idx"
            class="error-code fr-py-2v">
            {{ choices.t('errors.error') }} {{ resp.status }}
            :
            "{{ resp.message }}"
          </code>
        </p>
        <p>
          {{ choices.t(`form.contactHelp`) }} <br> {{ contactEmail }}
        </p>
      </div>
      <!-- DEBUGGING -->
      <div
        class="fr-mt-5v fr-highlight"
        v-if="debug && requestResponses?.filter(resp => resp.status && ![200, 201].includes(resp.status))">
        <p
          v-for="(resp, i) in requestResponses"
          :key="`resp-${i}`">
          <b>
            {{ resp.action }} :
          </b>
          <b>
            status {{ resp.status }} :
          </b>
          <b>
            "{{ resp.code }}"
          </b>
          <br>
          <i>
            {{ resp.message }}
          </i>
        </p>
      </div>
    </div>

    <!-- NOW WHAT -->
    <div v-if="hasNoRespError" class="fr-text-center">
      <p class="tee-form-response-title">
        <v-icon name="ri-checkbox-circle-fill" aria-hidden="true" scale="3"></v-icon>
      </p>
      <h3
        class="tee-form-response-title">
        {{ choices.t(`form.sent`) }}
      </h3>
      <h6 class="fr-mt-15v fr-mb-3v">
        {{ choices.t('form.nowWhat')}}
      </h6>
      <p class="fr-mb-15v">
        <span>
          {{ choices.ti(choices.t('form.phoneContact'), { operator: program['opérateur de contact'] }) }}
        </span>
      </p>
    </div>
  </div>

  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug fr-mt-5v">
    <h5>DEBUG - TeeForm</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div
        v-if="false"
        class="fr-col-12">
        <h4>
          formOptions :
        </h4>
        <code><pre>{{ formOptions }}</pre></code>
      </div>
      <div class="fr-col-12">
        <h4>
          formData :
        </h4>
        <code><pre>{{ formData }}</pre></code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// CONSOLE LOG TEMPLATE
// console.log(`TeeForm > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed, onBeforeMount, ref, toRaw } from 'vue'

// @ts-ignore
import type { FormCallback, FormField, FormOptions, FormValues, ProgramData, ReqResp } from '@/types/index'
import { CallbackActions, FormFieldTypes } from '@/types/index'

import { sendApiRequest } from '../utils/requests'
import { remapItem } from '../utils/helpers'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'
import { analyticsStore } from '../stores/analytics'
import DsfrButton from '@/components/button/DsfrButton.vue'

const choices = choicesStore()
const tracks = tracksStore()
const analytics = analyticsStore()

const trackValues: any[] = tracks.getAllUsedTracksValues

// @ts-ignore
const metaEnv = import.meta.env
const contactEmail: string = metaEnv.VITE_CONTACT_EMAIL || 'france-transition@beta.gouv.fr'

interface DataProps {
  programId: string
}

interface Props {
  trackId: string,
  formOptions: FormOptions,
  dataProps: DataProps,
  program: ProgramData,
  debug?: boolean
}
const props = defineProps<Props>()

let formData = ref()
const requiredFields = ref([])
const formIsSent = ref<boolean>(false)
const requestResponses = ref<ReqResp[]>()
const formFieldTypes = FormFieldTypes
const isLoading = ref<boolean>(false)

const canSaveFrom = computed(() => {
  // @ts-ignore
  const boolArr = requiredFields.value.map((f: string) => formData.value[f])
  return boolArr.every(v => (!!v && v !== ''))
})

const hasNoRespError = computed(() => {
  const hasError = !requestResponses.value || requestResponses.value?.map(r => r.status).every(s => s === 200 || s === 201)
  return hasError
})

const findPrefix = (str: string, prefixCode: string = 'of') => {
  return choices.t(`articles.${str}.${prefixCode}`)
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const isCheckbox = (field: FormField) => {
  return field.type === FormFieldTypes.Checkbox
}

const isTextarea = (field: FormField) => {
  return field.type === FormFieldTypes.Textarea
}


onBeforeMount(() => {
  let initValues: FormValues = {}

  // set up InitValues from formOptions.fields
  props.formOptions.fields?.forEach((field: FormField) => {
    // set field's key
    initValues[field.id] = isCheckbox(field) ? false : ''

    // @ts-ignore
    if (field.required) { requiredFields.value.push(field.id) }

    // set default value if any
    if (field.defaultValue) {
      let defaultVal = field.defaultValue
      if (field.injectInText) {
        const defaultValStr = defaultVal.toString()
        const dataStructure = field.dataStructure || {}
        const dataMapping = field.dataMapping || []
        const values = remapItem(dataStructure, dataMapping, {}, trackValues, props, undefined, [], choices.lang)
        defaultVal = choices.ti(defaultValStr, values)
      }
      initValues[field.id] = defaultVal
    }

    // inject value into form from store if any
    if (field.preFillFrom) {
      initValues = remapItem(initValues, [field.preFillFrom], {}, trackValues, props, undefined, [], choices.lang)
    }
  })
  formData = ref(initValues)
})

const updateFormData = (ev: string, id: string) => {
  formData.value[id] = ev
}

const saveFormData = async () => {
  try {
    isLoading.value = true

    // Launch call backs if any
    const responses: ReqResp[] = []
    // loop callbacks (only active ones)
    const activeCallbacks = toRaw(props.formOptions.callbacks).filter((cb: FormCallback) => !cb.disabled)
    for (const callback of activeCallbacks) {
      console.log()
      let resp: ReqResp = {}
      switch (callback.action) {
        case CallbackActions.CreateContact:
          resp = await sendApiRequest(callback, toRaw(formData.value), trackValues, props.dataProps, choices.lang)
          break
        case CallbackActions.SendTransactionalEmail:
          resp = await sendApiRequest(callback, toRaw(formData.value))
          break
      }
      responses.push(resp)
    }
    requestResponses.value = responses
    formIsSent.value = true

    // analytics / send event
    analytics.sendEvent(props.trackId, 'send_form')
  } finally {
    isLoading.value = false
  }
}

</script>
