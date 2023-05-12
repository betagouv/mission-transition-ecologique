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
      </div>
    </div>
  </div>

  <!-- STEPPER -->
  <DsfrFooter
    >
  </DsfrFooter>

</template>

<script setup lang="ts">

import { choicesStore } from '../stores/choices'

const choices = choicesStore()

interface Props {
  debug?: boolean,
}
const props = defineProps<Props>()


</script>
