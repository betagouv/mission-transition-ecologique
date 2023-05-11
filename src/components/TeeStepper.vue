<template>
  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug" 
    >
    <h5>DEBUG - TeeStepper</h5>
    <div 
      v-if="true"
      class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v"> choices.lang : <code>{{ choices.lang }} </code></h6>
        <h6 class="fr-mb-1v"> currentStep : <code>{{ currentStep }} </code></h6>
      </div>
  
      <div class="fr-col-3">
        <h6 class="fr-mb-1v"> stepsLen : <code>{{ stepsLen }} </code></h6>
        <h6 class="fr-mb-1v"> isLastStep : <code>{{ isLastStep }} </code></h6>
      </div>

      <div class="fr-col-6">
        <h6 class="fr-mb-1v">
          stepsArrayTranslated :
        </h6>
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

// @ts-ignore
import type { Dict } from '@/types/index'

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
