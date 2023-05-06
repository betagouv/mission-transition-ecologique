<template>
  <!-- DEBUGGING -->
  <div v-if="debug">
    <h3>DEBUG - Stepper</h3>
    <div 
      v-if="true"
      class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-3">
        <h5 class="fr-mb-1v"> choices.lang : <code>{{ choices.lang }} </code></h5>
        <h5 class="fr-mb-1v"> currentStep : <code>{{ currentStep }} </code></h5>
        <h5 class="fr-mb-1v"> stepsLen : <code>{{ stepsLen }} </code></h5>
        <h5 class="fr-mb-1v"> isLastStep : <code>{{ isLastStep }} </code></h5>
      </div>
  
      <div class="fr-col-9">
        <h5 class="fr-mb-1v">
          stepsArrayTranslated :
        </h5>
        <code>{{ stepsArrayTranslated  }}</code>
      </div>
    </div>
  </div>

  <!-- STEPPER -->
  <DsfrStepper
    :steps="stepsArrayTranslated"
    :current-step="currentStep"
    :class="`fr-mb-${ isLastStep ? '14v' : '0'}`"
  />
</template>

<script setup lang="ts">

import { computed } from 'vue'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'

interface Props {
  stepsArray: string[],
  currentStep: number,
  debug?: boolean,
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()

interface Dict {
  id: string,
  label: any,
}

const stepsArrayTranslated = computed(() => {
  const translated = props.stepsArray.map((id: string) => {
    const strTranslated = tracks.tracksStepsArrayDict.find((i: Dict) => i.id === id)
    return strTranslated?.label[choices.lang]
  })
  return translated
})

const stepsLen = computed(() => {
  const len: number = stepsArrayTranslated.value.length
  return len
})

const isLastStep = computed(() => {
  return stepsLen.value === props.currentStep
})

</script>
