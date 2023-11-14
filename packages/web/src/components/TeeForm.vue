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
          v-if="field.type !== formFieldTypes.checkbox">
          <DsfrInput
            :type="field.type"
            :is-textarea="field.type === formFieldTypes.textarea"
            :rows="field.type === formFieldTypes.textarea && (field.rows || 4)"
            :model-value="formData[field.id]"
            label-visible
            :required="field.required"
            :label="field.label[choices.lang]"
            :placeholder="(field.hint && field.hint[choices.lang]) || ''"
            @update:modelValue="updateFormData($event, field.id)"
            >
          </DsfrInput>
        </DsfrInputGroup>

        <!-- CHECKBOXES -->
        <DsfrCheckbox
          v-if="field.type === formFieldTypes.checkbox"
          :model-value="formData[field.id]"
          :name="field.id"
          :required="field.required"
          @update:modelValue="updateFormData($event, field.id)">
          <!-- :hint="field.hint[choices.lang]" -->
          <template #label>
            <span>
              {{ field.label[choices.lang] }}
            </span>
          </template>
        </DsfrCheckbox>

        <!-- CHECKBOX HINT -->
        <div v-if="field.type === formFieldTypes.checkbox">
          <span
            class="fr-hint-text fr-mt-5v"
            v-html="field.hint[choices.lang] || ''">
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
        />
      </div>
    </div>
  </div>

  <!-- FORM CALLBACK -->
  <div
    v-if="formIsSent"
    class="fr-mt-5v fr-tee-form">
    <!-- FORM ALERT AFTER SENDING-->
    <div :class="`fr-alert fr-alert--${!requestResponses || requestResponses?.map(r => r.status).every(s => s === 200 || s === 201) ? 'success' : 'error'}`">
      <h3 class="fr-alert__title">
        {{ choices.t(`form.sent`) }}
      </h3>
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
    <h6 class="fr-mt-10v">
      {{ choices.t('form.nowWhat')}}
    </h6>
    <p class="fr-mt-10v fr-mb-3v">
      <span class="fr-icon-arrow-right-line fr-mr-3v" aria-hidden="true"></span>
      <span v-html="choices.t('form.advisors')"></span>
    </p>
    <p class="fr-mb-3v">
      <span class="fr-icon-arrow-right-line fr-mr-3v" aria-hidden="true"></span>
      <span v-html="choices.t('form.phoneContact')"></span>
    </p>
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

import { onBeforeMount, ref, computed, toRaw } from 'vue'

// @ts-ignore
import type { FormValues, FormField, FormOptions, FormCallback, ProgramData, ReqResp } from '@/types/index'

import { sendApiRequest } from '../utils/requests'
import { remapItem } from '../utils/helpers'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'
import { analyticsStore } from '../stores/analytics'
import { FormFieldTypes } from '@/types/index'

const choices = choicesStore()
const tracks = tracksStore()
const analytics = analyticsStore()

// const usedTracks: UsedTrack[] | any[] = tracks.getAllUsedTracks
const trackValues: any[] = tracks.getAllUsedTracksValues

interface DataProps {
  programId: string
}

interface Props {
  trackId: string,
  formOptions: FormOptions,
  dataProps: DataProps,
  program: ProgramData,
  debug?: boolean,
}
const props = defineProps<Props>()

let formData = ref()
const requiredFields = ref([])
const formIsSent = ref<boolean>(false)
const requestResponses = ref<ReqResp[]>()
const formFieldTypes = FormFieldTypes

// const program = computed(() => {
//   return programs.getProgramById(props.dataProps.programId)
// })

const canSaveFrom = computed(() => {
  // @ts-ignore
  const boolArr = requiredFields.value.map((f: string) => formData.value[f])
  return boolArr.every(v => (!!v && v !== ''))
})

const findPrefix = (str: string, prefixCode: string = 'of') => {
  return choices.t(`articles.${str}.${prefixCode}`)
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}


onBeforeMount(() => {
  // console.log('TeeForm > onBeforeMount >  props.formOptions :', props.formOptions)
  // console.log('TeeForm > onBeforeMount >  usedTracks :', usedTracks)
  // console.log('TeeForm > onBeforeMount >  trackValues :', trackValues)

  let initValues: FormValues = {}

  // set up InitValues from formOptions.fields
  props.formOptions.fields?.forEach((field: FormField) => {
    // console.log('TeeForm > onBeforeMount >  field :', field)

    // set field's key
    initValues[field.id] = field.type === 'checkbox' ? false : ''

    // @ts-ignore
    if (field.required) { requiredFields.value.push(field.id) }

    // set default value if any
    if (field.defaultValue) {
      let defaultVal = field.defaultValue
      if (field.injectInText) {
        const defaultValStr = defaultVal.toString()
        const dataStructure = field.dataStructure || {}
        const dataMapping = field.dataMapping || []
        // console.log('TeeForm > onBeforeMount > defaultVal : ', defaultVal)
        // console.log('TeeForm > onBeforeMount > dataStructure : ', dataStructure)
        // console.log('TeeForm > onBeforeMount > dataMapping : ', dataMapping)
        // console.log('TeeForm > onBeforeMount > trackValues : ', trackValues)
        const values = remapItem(dataStructure, dataMapping, {}, trackValues, props, undefined, [], choices.lang)
        // console.log('TeeForm > onBeforeMount > values : ', values)
        defaultVal = choices.ti(defaultValStr, values)
      }
      initValues[field.id] = defaultVal
    }

    // inject value into form from store if any
    if (field.preFillFrom) {
      // console.log('TeeForm > onBeforeMount >  field.preFillFrom :', field.preFillFrom)
      initValues = remapItem(initValues, [field.preFillFrom], {}, trackValues, props, undefined, [], choices.lang)
      // console.log('TeeForm > onBeforeMount >  initValues :', initValues)
    }
  })
  // console.log('TeeForm > onBeforeMount >  initValues :', initValues)
  formData = ref(initValues)
})

const updateFormData = (ev: string, id: string) => {
  // console.log(`TeeForm > saveFormData >  id : ${id} > ev : ${ev}`)
  formData.value[id] = ev
}

// const emit = defineEmits(['saveData'])
const saveFormData = async () => {
  // console.log('TeeForm > saveFormData >  props.formOptions :', props.formOptions)
  // console.log('TeeForm > saveFormData >  props.dataProps :', props.dataProps)
  // console.log('TeeForm > saveFormData >  formData.value :', formData.value)

  // const usedTracks: UsedTrack[] | any[] = tracks.getAllUsedTracks
  // console.log('TeeForm > saveFormData >  usedTracks :', usedTracks)

  // Launch call backs if any
  const responses: ReqResp[] = []
  // loop callbacks (only active ones)
  const activeCallbacks = toRaw(props.formOptions.callbacks).filter((cb: FormCallback) => !cb.disabled)
  for (const callback of activeCallbacks) {
    console.log()
    // console.log('TeeForm > saveFormData >  callback.action :', callback.action)
    let resp: ReqResp = {}
    switch (callback.action) {
      case 'createContact':
        resp = await sendApiRequest(callback, toRaw(formData.value), trackValues, props.dataProps, choices.lang)
        break
      case 'sendTransactionalEmail':
        resp = await sendApiRequest(callback, toRaw(formData.value))
        break
    }
    responses.push(resp)
    // console.log('TeeForm > saveFormData >  resp :', resp)
  }
  requestResponses.value = responses
  formIsSent.value = true

  // analytics / send event
  analytics.sendEvent(props.trackId, 'send_form')

}

</script>
