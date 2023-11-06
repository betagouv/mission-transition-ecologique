<template>

  <!-- DEBUGGING -->
  <div 
    v-if="debug"
    class="vue-debug">
    <h5>DEBUG - TeeResults</h5>
    <!-- <h6>
      programs.programDetail : <code>{{ programs.programDetail || 'undefined' }}</code>
    </h6> -->
  </div>

  <!-- RESULTS ALERT -->
  <DsfrAlert
    v-if="trackConfig && trackConfig.showAlertResults && resultsProgsLen"
    :title="choices.t('results.alertTitle')"
    :description="choices.t('results.alertDescription')"
    type="success">
  </DsfrAlert>
  <DsfrAlert
    v-if="trackConfig && trackConfig.showAlertNoResults && !resultsProgsLen"
    :title="choices.t('results.alertTitleNoResults')"
    :description="choices.t('results.alertNoResults')"
    type="warning">
  </DsfrAlert>

  <!-- DEBUGGING -->
  <h4
    v-if="trackConfig && trackConfig.showResultsTitle && resultsProgsLen"
    class="fr-pt-12v">
    {{ choices.t('results.fittingPrograms') }}
    ({{ resultsProgsLen }})
  </h4>

  <!-- PROGRAMS AS LIST OF CARDS -->
  <div 
    v-if="resultsProgsLen"
    class="fr-container fr-px-0 fr-pt-6v">

    <!-- PROGRAM CARD -->
    <div
      v-for="prog in resultsProgs"
      :key="prog.id"
      class="fr-card fr-enlarge-link fr-card--horizontal-tier fr-mb-10v"
      @click="updateDetailResult(prog.id)">
      <div class="fr-card__body">
        <div class="fr-card__content">
          <!-- TITLE -->
          <div class="fr-card__start fr-mb-2v">
            <p 
              class="tee-program-title">
              {{ prog.titre }}
            </p>
          </div>
          <!-- CONTENT -->
          <h2 
            class="fr-card__title tee-program-resume fr-mb-3v">
            {{ prog.promesse }} 
          </h2>
          <!-- DEBUG -->
          <p
            v-if="debug"
            class="vue-debug fr-card__desc">
            <br> choices.publicPath : <code>{{ choices.publicPath }}</code>
            <br> prog.cover : <code>{{ prog.illustration }}</code>
            <!-- {{ `${choices.publicPath}${randomImage()}` }} -->
          </p>
          <!-- END -->
          <div class="fr-card__end">
            <p 
              class="fr-mb-0 tee-program-info">
              <span 
                class="fr-icon-money-euro-circle-line" 
                aria-hidden="true">
              </span>
              {{ getCostInfos(prog) }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="prog.illustration"
        class="fr-card__header">
        <div class="fr-card__img">
          <img 
            class="fr-responsive-img"
            :src="`${choices.publicPath}${prog.illustration}`"
            :alt="`image / ${prog.titre}`"
            />
          <!-- L’alternative de l’image (attribut alt) doit toujours être présente, 
            sa valeur peut être vide (image n’apportant pas de sens supplémentaire au contexte) 
            ou non (porteuse de texte ou apportant du sens) selon votre contexte -->
        </div>
        <ul class="fr-badges-group">
          <p class="fr-badge tee-program-badge-image">
            {{ prog["nature de l'aide"] }}
          </p>
        </ul>
      </div>
    </div>
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

import { onBeforeMount, computed } from 'vue'
import { choicesStore } from '../stores/choices'
import { programsStore } from '../stores/programs'
import { navigationStore } from '../stores/navigation'
import { analyticsStore } from '../stores/analytics'

import { scrollToTop, consolidateAmounts } from '../utils/helpers'

// @ts-ignore
import type { TrackChoice, TrackResultsConfig, ProgramData } from '@/types/index'
// @ts-ignore
import { ProgramAidType } from '@/types/programTypes'
// @ts-ignore
// import { randomChoice } from '@/utils/helpers'

const choices = choicesStore()
const programs = programsStore()
const analytics = analyticsStore()
const nav = navigationStore()

// const defaultImages = [
//   'images/TEE_ampoule.png',
//   'images/TEE_energie_verte.png',
//   'images/TEE_eolienne.png',
//   // 'images/TEE-illustrationHP.png'
// ]

interface Props {
  trackId: string,
  trackConfig?: TrackResultsConfig,
  trackOptions?: any,
  trackForm?: any,
  tracksResults: TrackChoice[] | any[],
  trackElement: any,
  disableWidget?: boolean,
  debug?: boolean,
}
const props = defineProps<Props>()

const resultsProgs: ProgramData[] = programs.filterPrograms(props.tracksResults)

const resultsProgsLen = computed(() => {
  return resultsProgs.length
})

const updateDetailResult = (id: string | number) => {
  // console.log(`TeeResults > updateDetailResult >  id : ${id}`)
  programs.setDetailResult(id, props.trackId)
  nav.setCurrentDetailId(id)
  !props.disableWidget && scrollToTop(props.trackElement, props.trackId)
}

const getCostInfos = (program: ProgramData) => {
  let prefix: string = ''
  let text: string | undefined = ''
  // console.log('TeeResults > onBeforeMount > resultsProgs :', resultsProgs )

  switch (program["nature de l'aide"]) {
    case ProgramAidType.acc:
      prefix = 'programCosts.costPrefix'
      text = program["coût de l'accompagnement"]
      break
    case ProgramAidType.train:
      prefix = 'programCosts.costPrefix'
      text = program["coût de l'accompagnement"]
      break
    case ProgramAidType.fund:
      prefix = 'programCosts.aidPrefix'
      text = program['montant du financement']
      break
    case ProgramAidType.loan:
      prefix = 'programCosts.loan'
      text = program['montant du prêt']
      break
  }
  // Translate prefix
  prefix = choices.t(prefix)

  // No splitted amounts (non-breakable spaces in texts like '10 000 €')
  text = consolidateAmounts(text)

  return `${prefix} : ${text}`
}

onBeforeMount(() => {
  // console.log('TeeResults > onBeforeMount > resultsProgs :', resultsProgs )
  // analytics / send event
  analytics.sendEvent(props.trackId, 'show_results')
})

// const randomImage = () => {
//   const imagePath = randomChoice(defaultImages)
//   return imagePath
// }
</script>