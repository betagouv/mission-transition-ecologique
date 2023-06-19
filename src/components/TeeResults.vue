<template>

  <!-- DEBUGGING -->
  <div 
    v-if="debug"
    class="vue-debug">
    <h5>DEBUG - TeeResults</h5>
    <h6>
      expandedId : 
      <code>
        {{ expandedId || 'undefined' }}
      </code>
    </h6>
  </div>

  <!-- RESULTS ALERT -->
  <DsfrAlert
    v-if="trackConfig && trackConfig.showAlert"
    :title="choices.t(`results.${resultsProgsLen ? 'alertTitle' : 'alertTitleNoResult'}`)"
    :description="choices.t(`results.${resultsProgsLen ? 'alertDescription' : 'alertNoResult'}`)"
    :type="resultsProgsLen ? 'success' : 'warning'">
  </DsfrAlert>
  
  <!-- DEBUGGING -->
  <h4
    v-if="trackConfig && trackConfig.showResultsTitle && resultsProgsLen"
    class="fr-pt-12v">
    {{ choices.t('results.fittingPrograms') }}
    ({{ resultsProgsLen }})
  </h4>

  <!-- PROGRAMS AS LIST IN ACCORDIONS -->
  <div 
    v-if="resultsProgsLen"
    class="fr-container fr-px-0 fr-pt-6v">

    <!-- PROGRAM CARD -->
    <div
      v-for="prog in resultsProgs"
      :key="prog.index"
      class="fr-card fr-enlarge-link fr-card--horizontal-half fr-mb-6v">
      <div class="fr-card__body">
        <div class="fr-card__content">
          <h3 class="fr-card__title">
            <a href="#">
              {{ prog.resume }} 
            </a>
          </h3>
          <!-- <p
            class="fr-card__desc"
            v-html="prog.description">
          </p> -->
          <p
            v-if="debug"
            class="vue-debug fr-card__desc">
            <br> choices.publicPath : <code>{{ choices.publicPath }}</code>
            <br> prog.cover : <code>{{ prog.cover }}</code>
          </p>
          <div class="fr-card__start">
            <ul class="fr-badges-group">
              <li>
                <p class="fr-badge fr-badge--info fr-badge--no-icon">
                  {{ prog.title }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        v-if="prog.cover"
        class="fr-card__header">
        <div class="fr-card__img">
          <img 
            class="fr-responsive-img"
            :src="`${choices.publicPath}${prog.cover}`"
            :alt="`image / ${prog.title}`"
            />
          <!-- L’alternative de l’image (attribut alt) doit toujours être présente, sa valeur peut-être vide (image n’apportant pas de sens supplémentaire au contexte) ou non (porteuse de texte ou apportant du sens) selon votre contexte -->
        </div>
        <ul class="fr-badges-group">
          <li
            v-for="provider in prog.program_providers"
            :key="provider.code || provider"
            >
            <p class="fr-badge">
              {{ provider.code }}
            </p>
          </li>
        </ul>
      </div>
    </div>


    <DsfrAccordionsGroup
      v-if="false">
      <li
        v-for="prog in resultsProgs"
        :key="prog.index"
        >
        <DsfrAccordion
          :id="`${prefix}${prog.index}`"
          :expanded-id="expandedId"
          @expand="updateExpandedId"
          >
          <template #title>
            <h6
              :style="expandedId === `${prefix}${prog.index}` ? `color: ${blockColor}` : ''">
              <!-- {{ i + 1 }}) &nbsp;  -->
              <v-icon
                class="fr-pt-2v fr-pb-0"
                name="ri-record-circle-fill"/>
              {{ prog.title }}
            </h6>
          </template>
          <template #default>
            <TeeProgram
              :program="prog"
              :config="trackConfig"
              :options="trackOptions"
              :debug="debug"/>
          </template>
        </DsfrAccordion>
      </li>
    </DsfrAccordionsGroup>
  </div>

  <div
    v-if="false" 
    class="fr-mt-18v">
    <TeeForm
      :track-id="trackId"
      :form-options="trackForm"
      :debug="debug"/>
  </div>

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

import { ref, onBeforeMount, computed } from 'vue'
import { choicesStore } from '../stores/choices'
import { programsStore } from '../stores/programs'
import { analyticsStore } from '../stores/analytics'

// @ts-ignore
import TeeProgram from './TeeProgram.vue'
// @ts-ignore
import TeeForm from './TeeForm.vue'
// @ts-ignore
import type { TrackChoice, TrackResultsConfig } from '@/types/index'

const choices = choicesStore()
const programs = programsStore()
const analytics = analyticsStore()

interface Props {
  trackId: string,
  trackConfig?: TrackResultsConfig,
  trackOptions?: any,
  trackForm?: any,
  tracksResults: TrackChoice[] | any[],
  debug?: boolean,
}
const props = defineProps<Props>()

const blockColor= 'var(--text-default-info)'

const resultsProgs = programs.filterPrograms(props.tracksResults)

const resultsProgsLen = computed(() => {
  return resultsProgs.length
})

const prefix = 'accordion-results-'
const expandedId = ref()

const updateExpandedId = (id: string) => {
  // console.log(`TeeResults > saveFormData >  id : ${id} > ev : ${ev}`)
  expandedId.value = id
}

// watch(resultsProgs, async( newProgs ) => {
//   console.log('TeeResults > watch > resultsProgs :', resultsProgs )
//   console.log('TeeResults > watch > newProgs :', newProgs )
// })

onBeforeMount(() => {
  // console.log('TeeResults > onBeforeMount > resultsProgs :', resultsProgs )
  const firstProg = resultsProgs && resultsProgs[0]
  if (firstProg) {
    updateExpandedId(`${prefix}${firstProg.index}`)
  }
  // analytics / send event
  analytics.sendEvent(props.trackId, 'show_results')
})
</script>