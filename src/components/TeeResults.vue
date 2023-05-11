<template>

  <!-- DEBUGGING -->
  <div 
    v-if="debug"
    class="vue-debug">
    <h5>DEBUG - TeeResults</h5>
  </div>

  <!-- RESULTS ALERT -->
  <DsfrAlert
    :title="choices.t('results.alertTitle')"
    :description="choices.t(`results.${resultsProgsLen ? 'alertDescription' : 'alertNoResult'}`)"
    :type="resultsProgsLen ? 'success' : 'warning'">
  </DsfrAlert>
  
  <!-- DEBUGGING -->
  <h4
    v-if="resultsProgsLen"
    class="fr-pt-12v">
    {{ choices.t('results.fittingPrograms') }}
    ({{ resultsProgsLen }})
  </h4>

  <!-- PROGRAMS AS LIST IN ACCORDIONS -->
  <div 
    v-if="resultsProgsLen"
    class="fr-container">

    <DsfrAccordionsGroup>
      <li
        v-for="(prog, i) in resultsProgs"
        :key="prog.index"
        >
        <DsfrAccordion
          :id="`accordion-results-${prog.index}`"
          :expanded-id="expandedId"
          @expand="updateExpandedId"
          >
          <template #title>
            <h6>
              {{ i + 1 }}/ {{ prog.title }}
            </h6>
          </template>
          <template #default>
            <!-- AID TITLE -->
            <p 
              v-if="prog.resume"
              v-html="prog.resume">
            </p>
  
            <!-- AID DESCRIPTION -->
            <p 
              v-if="prog.description"
              v-html="prog.description">
            </p>
          </template>
        </DsfrAccordion>
      </li>
    </DsfrAccordionsGroup>
  </div>

  <!-- <h4 class="fr-pt-10v">
    {{ choices.t('results.fittingPrograms') }} 
    ({{ resultsProgsLen }})
  </h4> -->

  <!-- DEBUGGING -->
  <div 
    v-if="debug"
    class="vue-debug">
    <h5>DEBUG - TeeResults</h5>
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
  </div>


</template>

<script setup lang="ts">

import { ref, computed } from 'vue'
import { choicesStore } from '../stores/choices'
import { programsStore } from '../stores/programs'

// @ts-ignore
import type { TrackChoice } from '@/types/index'

const choices = choicesStore()
const programs = programsStore()

interface Props {
  tracksResults: TrackChoice[],
  debug?: boolean,
}
const props = defineProps<Props>()

const resultsProgs = programs.filterPrograms(props.tracksResults)

const resultsProgsLen = computed(() => {
  return resultsProgs.length
})

const expandedId = ref()

const updateExpandedId = (id: string) => {
  // console.log(`TeeForm > saveFormData >  id : ${id} > ev : ${ev}`)
  expandedId.value = id
}
</script>