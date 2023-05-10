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
    <DsfrInputGroup>
      <DsfrInput
        type="text"
        label-visible
        :label="field.label[choices.lang]"
        :placeholder="field.hint[choices.lang]"
      />
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
        class="fr-col-12">
        <h4>
          formOptions :
        </h4>
        <code><pre>{{ formOptions }}</pre></code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

import { choicesStore } from '../stores/choices'
const choices = choicesStore()

// internationalization
const dict: any = {
  fr: {
    next: 'Suivant'
  }
}

interface FormField {
  id: string | number,
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

const formData = ref()

const saveFormData = () => {
  console.log('TeeForm > saveFormData >  formData :', formData.value)
}

</script>