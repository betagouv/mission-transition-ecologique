<template>
  <DsfrAlert
    :title="choices.t('results.alertTitle')"
    :description="choices.t('results.alertDescription')"
    type="success">
  </DsfrAlert>
  
  <h4 class="fr-pt-3v">
    {{ choices.t('results.yourResults') }}
  </h4>

  <!-- DEBUGGING -->
  <p 
    v-if="true"
    class="vue-debug">
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-6">
        <h6>tracksResults</h6>
        <code><pre>{{ tracksResults }}</pre></code>
      </div>
      <div class="fr-col-6">
        <h6>programs.progs</h6>
        <code><pre>{{ programs.progs }}</pre></code>
      </div>
    </div>
  </p>

  <h4 class="fr-pt-3v">
    <!-- {{ choices.dict[choices.lang].results.fittingPrograms }} -->
    {{ choices.t('results.fittingPrograms') }}
  </h4>
</template>

<script setup lang="ts">

// import { computed } from 'vue'

import { choicesStore } from '../stores/choices'
import { programsStore } from '../stores/programs'

const choices = choicesStore()
const programs = programsStore()

interface trackChoice {
  id: string | number,
  step: number,
  values: string[] | object[],
  data?: object | object[]
}

interface Props {
  tracksResults: trackChoice[],
  debug?: boolean,
}
const props = defineProps<Props>()

</script>