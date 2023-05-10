<template>
  <!-- FORM LABEL -->
  <h4
    v-if="formOptions.label"
    class="fr-center">
    {{ formOptions.label[choices.lang] }}
  </h4>
  
  <!-- FORM INTRODUCTION -->
  <div 
    v-if="formOptions.intro"
    v-html="formOptions.intro[choices.lang]">
  </div>

  <p
    v-for="field in formOptions.fields"
    :key="field.id"
    >
    <div v-if="debug">
      Field.id: 
      <code>
        {{ field.id }} 
      </code >
      --- formData[field.id] : 
      <code >
        {{ formData[field.id] }}
      </code>
    </div>
    <DsfrInputGroup>
      <DsfrInput
        :type="field.type"
        :model-value="formData[field.id]"
        label-visible
        :required="field.required"
        :label="field.label[choices.lang]"
        :placeholder="field.hint[choices.lang]"
        @update:modelValue="updateFormData($event, field.id)"
        >
      </DsfrInput>
    </DsfrInputGroup>
  </p>

  <!-- SEND / NEXT BUTTON -->
  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
    <div class="fr-col-3">
      <DsfrButton
        style="width: -moz-available !important;"
        :label="dict[choices.lang].next" 
        icon="ri-arrow-right-line"
        @click="saveFormData()"
      />
    </div>
  </div>


  <!-- DEBUGGING -->
  <div 
    v-if="debug"
    class="fr-mt-5v">
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

import { onBeforeMount, ref, defineEmits } from 'vue'

import { choicesStore } from '../stores/choices'
const choices = choicesStore()

// internationalization
const dict: any = {
  fr: {
    next: 'Suivant'
  }
}

interface FormValues {
  [name: string]: any,
}

interface FormField {
  id: string,
  required: boolean,
  label?: any,
  hint?: any,
  type?: string
}

interface FormOptions {
  value: string | number,
  label?: any | null,
  intro?: any | null,
  fields?: FormField[],
  next?: string
}

interface Props {
  formOptions: FormOptions,
  debug?: boolean,
}
const props = defineProps<Props>()


let formData = ref()

const emit = defineEmits(['saveData'])

const saveFormData = () => {
  // console.log('TeeForm > saveFormData >  props.formOptions :', props.formOptions)
  // console.log('TeeForm > saveFormData >  formData.value :', formData.value)
  emit('saveData', {
    value: props.formOptions.value,
    next: props.formOptions.next,
    data: formData.value
  })
}

const updateFormData = (ev: string, id: string) => {
  // console.log(`TeeForm > saveFormData >  id : ${id} > ev : ${ev}`)
  formData.value[id] = ev
}

onBeforeMount(() => {
  // console.log('TeeForm > saveFormData >  props.formOptions :', props.formOptions)
  const initValues = <FormValues>{}
  props.formOptions.fields?.forEach((field: FormField) => {
    initValues[field.id] = ''
  })
  // formData = reactive(initValues)
  formData = ref(initValues)
})

</script>