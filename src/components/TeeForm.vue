<template>
  <!-- FORM LABEL -->
  <h4
    v-if="formOptions.label"
    class="fr-center">
    {{ formOptions.label[choices.lang] }}
  </h4>

  <!-- FORM -->
  <div v-show="!formIsSent">
    <!-- FORM INTRODUCTION -->
    <div 
      v-if="formOptions.intro"
      v-html="formOptions.intro[choices.lang]">
    </div>
  
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
  
    <!-- FIELDS -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4v">

      <div
        v-for="field in formOptions.fields"
        :key="field.id"
        :class="`fr-col-${ field.cols ? field.cols : 12 }`"
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
          v-if="field.type !== 'checkbox'">
          <DsfrInput
            :type="field.type"
            :is-textarea="field.type === 'textarea'"
            :model-value="formData[field.id]"
            label-visible
            :required="field.required"
            :label="field.label[choices.lang]"
            :placeholder="field.hint[choices.lang]"
            @update:modelValue="updateFormData($event, field.id)"
            >
          </DsfrInput>
        </DsfrInputGroup>
        
        <!-- CHECKBOXES -->
        <DsfrCheckbox
          v-if="field.type == 'checkbox'"
          :model-value="formData[field.id]"
          :name="field.id" 
          :required="field.required"
          :hint="field.hint[choices.lang]"
          @update:modelValue="updateFormData($event, field.id)">
          <template #label>
            <span>
              {{ field.label[choices.lang] }}
            </span>
          </template>
        </DsfrCheckbox>
      </div>

    </div>

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
        style="display: grid; justify-content: center;">
        <!-- :label="choices.t('next')"  -->
        <DsfrButton
          :label="choices.t('send')" 
          :disabled="!canSaveFrom"
          icon="ri-arrow-right-line"
          @click="saveFormData()"
        />
      </div>
    </div>
  </div>
  
  <!-- FORM CALLBACK -->
  <div
    v-if="formIsSent"
    class="fr-mt-5v">
    <!-- FORM ALERT AFTER SENDING-->
    <DsfrAlert
      :title="choices.t(`form.sent`)"
      :type="'success'">
    </DsfrAlert>

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

import { onBeforeMount, ref, computed, toRaw, defineEmits } from 'vue'

// @ts-ignore
import type { FormValues, FormField, FormOptions, UsedTrack } from '@/types/index'

import { sendEmail } from '../utils/emailing'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'
const choices = choicesStore()
const tracks = tracksStore()

interface Props {
  formOptions: FormOptions,
  debug?: boolean,
}
const props = defineProps<Props>()

let formData = ref()
const requiredFields = ref([])
const formIsSent = ref(false)

const canSaveFrom = computed(() => {
  // @ts-ignore
  const boolArr = requiredFields.value.map((f: string) => formData.value[f])
  return boolArr.every(v => (!!v && v !== ''))
})   

onBeforeMount(() => {
  // console.log('TeeForm > saveFormData >  props.formOptions :', props.formOptions)
  const initValues = <FormValues>{}
  props.formOptions.fields?.forEach((field: FormField) => {
    initValues[field.id] = field.type === 'checkbox' ? false : ''
    if (field.defaultValue) { initValues[field.id] = field.defaultValue }
    // @ts-ignore
    if (field.required) { requiredFields.value.push(field.id) }
  })
  formData = ref(initValues)
})

const updateFormData = (ev: string, id: string) => {
  // console.log(`TeeForm > saveFormData >  id : ${id} > ev : ${ev}`)
  formData.value[id] = ev
}

// const emit = defineEmits(['saveData'])
const saveFormData = () => {
  console.log('TeeForm > saveFormData >  props.formOptions :', props.formOptions)
  console.log('TeeForm > saveFormData >  formData.value :', formData.value)
  
  const usedTracks: UsedTrack[] | any[] = tracks.getAllUsedTracks
  console.log('TeeForm > saveFormData >  usedTracks :', usedTracks)
  
  // Launch call backs if any
  sendEmail(toRaw(props.formOptions.callbacks), toRaw(formData.value), usedTracks)
  
  // emit('saveData', {
  //   value: props.formOptions.value,
  //   next: props.formOptions.next,
  //   data: formData.value
  // })
  // formIsSent.value = true
}  

</script>