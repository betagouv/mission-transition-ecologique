<template>
  <DsfrAlert
    :title="choices.t('results.alertTitle')"
    :description="choices.t('results.alertDescription')"
    type="success">
  </DsfrAlert>
  
  <h4 class="fr-pt-12v">
    {{ choices.t('results.fittingPrograms') }}
    ({{ resultsProgsLen }})
  </h4>

  <DsfrAccordionsGroup>
    <li
      v-for="prog in resultsProgs.programs"
      :key="prog.index"
      >
      <DsfrAccordion
        :id="`accordion-results-${prog.index}`"
        :expanded-id="expandedId"
        @expand="updateExpandedId"
        >
        <template #title>
          <h6>
            {{ prog.title }}
          </h6>
        </template>
        <template #default>
          <p v-html="prog.resume"></p>
          <p v-html="prog.description"></p>
        </template>
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>

  <!-- <h4 class="fr-pt-10v">
    {{ choices.t('results.fittingPrograms') }} 
    ({{ resultsProgsLen }})
  </h4> -->

  <!-- DEBUGGING -->
  <p 
    v-if="debug"
    class="vue-debug">
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-6">
        <h6>resultsProgs</h6>
        <code><pre>{{ resultsProgs }}</pre></code>
      </div>
      <div class="fr-col-6">
        <h6>tracksResults</h6>
        <code><pre>{{ tracksResults }}</pre></code>
        <h6>programs.progs</h6>
        <code><pre>{{ programs.progs }}</pre></code>
      </div>
    </div>
  </p>


</template>

<script setup lang="ts">

import { ref, computed } from 'vue'
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

const resultsProgs = computed(() => {
  return programs.filterPrograms(props.tracksResults)
})

const resultsProgsLen = computed(() => {
  return resultsProgs.value.programs.length
})

const expandedId = ref()

const updateExpandedId = (id: string) => {
  // console.log(`TeeForm > saveFormData >  id : ${id} > ev : ${ev}`)
  expandedId.value = id
}
</script>