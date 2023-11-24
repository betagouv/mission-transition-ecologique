<template>

  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug">
    <h5>DEBUG - TeeResults</h5>
    <!-- <h6>
      programs.programDetail : <code>{{ programs.programDetail || 'undefined' }}</code>
    </h6> -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v"> trackId : <code>{{ trackId }} </code></h6>
      </div>
      <!-- <div class="fr-col-4">
        <h6 class="fr-mb-1v"> trackConfig : </h6>
          <pre><code>{{ trackConfig }} </code></pre>
      </div> -->
      <div class="fr-col-9">
        <h6 class="fr-mb-1v"> activeFilters : </h6>
          <pre><code>{{ activeFilters }} </code></pre>
      </div>
    </div>
  </div>

  <!-- RESULTS ALERT FOR NO RESULTS BEFORE REFILTERING-->
  <TeeNoResults
    v-if="!countFilteredPrograms"
    :image="trackConfig?.noResultsImage"
    :message="trackConfig?.noResultsMessage"
    >
  </TeeNoResults>

  <!-- RESULTS CALLBACK -->
  <h4
    v-if="countFilteredPrograms && trackConfig?.showResultsTitle"
    class="fr-pt-12v">
    {{ choices.t('results.fittingPrograms') }}
    ({{ countFilteredPrograms }})
  </h4>

  <!-- PROGRAMS AS LIST OF CARDS -->
  <div
    v-if="countFilteredPrograms"
    class="fr-container fr-px-0 fr-mt-6v">

    <!-- RESULTS SIZE -->
    <div
      v-if="countFilteredPrograms > 1"
      class="fr-mb-4v tee-text-light">
      {{ countReFilteredPrograms }}
      {{ choices.t('results.results') }}
    </div>

    <!-- FILTERS IF ANY -->
    <div
      v-if="trackConfig?.filters && countFilteredPrograms > 1"
      class="fr-grid-row fr-grid-row--gutters fr-mb-4v">
      <div
        v-for="filter in trackConfig.filters"
        :key="filter.label"
        class="fr-col">
        <TeeResultsFilter
          :filter="filter"
          :debug="debug"
          @updateFilter="updateFilters"/>
      </div>
    </div>

    <!-- NO RESULTS -->
    <TeeNoResults
      v-if="!countReFilteredPrograms"
      :image="trackConfig?.noResultsImage"
      :message="trackConfig?.noResultsMessage"
      >
    </TeeNoResults>

    <!-- PROGRAMS CARDS -->
    <div
      v-for="prog in reFilteredPrograms"
      :id="prog.id"
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
        <h6>filteredPrograms</h6>
        <code><pre>{{ filteredPrograms }}</pre></code>
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
import { choicesStore } from '../../stores/choices'
import { programsStore } from '../../stores/programs'
import { analyticsStore } from '../../stores/analytics'

import { getFrom, scrollToTop, consolidateAmounts } from '../../utils/helpers'

// @ts-ignore
import TeeResultsFilter from './TeeResultsFilter.vue'
// @ts-ignore
import TeeNoResults from './TeeNoResults.vue'

// @ts-ignore
import type { TrackChoice, TrackResultsConfig, ProgramData, FilterSignal, TrackFilter, PropertyPath } from '@/types/index'
// @ts-ignore
import { ProgramAidType } from '@/types/programTypes'
import { navigationStore } from '@/stores/navigation'
import { ConditionOperators, TrackId } from '@/types/index'
// @ts-ignore
// import { randomChoice } from '@/utils/helpers'

const choices = choicesStore()
const programs = programsStore()
const analytics = analyticsStore()
const nav = navigationStore()

const activeFilters = ref<any>({})

interface Props {
  trackId: TrackId,
  trackConfig?: TrackResultsConfig,
  trackOptions?: any,
  trackForm?: any,
  tracksResults: TrackChoice[] | any[],
  trackElement: any,
  disableWidget?: boolean,
  debug?: boolean
}
const props = defineProps<Props>()

const filteredPrograms: ProgramData[] = programs.filterPrograms(props.tracksResults)

const reFilteredPrograms = computed(() => {
  // console.log('\nTeeResults > reFilteredPrograms...' )
  // console.log('TeeResults > reFilteredPrograms > filteredPrograms :', filteredPrograms )
  const results = filteredPrograms.filter((prog: ProgramData) => {
    // console.log('\nTeeResults > reFilteredPrograms > prog :', prog )
    const boolArray = [true]
    for (const filterLabel in activeFilters.value) {
      const filterVal = activeFilters.value[filterLabel]
      const filterConfig: TrackFilter | undefined = props.trackConfig?.filters?.find((f:any) => f.label === filterLabel)
      const filterField: PropertyPath = filterConfig?.field || ''
      const trueIf = filterConfig?.trueIf || ConditionOperators.is
      console.log(`\nTeeResults > reFilteredPrograms > filterField: "${filterField}" - filterVal: "${filterVal}" - trueIf: "${trueIf}"` )
      console.log('\nTeeResults > filterField :', filterField )
      console.log('TeeResults > filterVal :', filterVal )
      console.log('TeeResults > trueIf :', trueIf )

      let progVal = getFrom(prog, [filterField])
      progVal = JSON.parse(JSON.stringify(progVal))
      progVal = progVal[0]

      let bool = false
      if (filterVal === '') {
        bool = true
      } else if (trueIf === ConditionOperators.is) {
        // console.log('TeeResults > reFilteredPrograms > progVal :', progVal )
        bool = progVal === filterVal
      } else if (trueIf === ConditionOperators.exists) {
        progVal = progVal?.filter(i => i !== null)
        // console.log('TeeResults > reFilteredPrograms > progVal :', progVal )
        bool = !progVal ? true : progVal.includes(filterVal)
      } else {
        bool = true
      }
      boolArray.push(bool)
    }
    // console.log('TeeResults > reFilteredPrograms > boolArray :', boolArray )
    const checkFilters = boolArray.every(b => !!b)
    // console.log('TeeResults > reFilteredPrograms > checkFilters :', checkFilters )
    return checkFilters
  })
  // console.log('TeeResults > reFilteredPrograms > results: ', results )
  return results
})

const countFilteredPrograms = computed(() => {
  return filteredPrograms.length
})

const countReFilteredPrograms = computed(() => {
  return reFilteredPrograms.value.length
})

const updateFilters = (event: FilterSignal) => {
  // console.log('\nTeeResults > updateFilters > event :', event )
  const val = {
    [event.label]: event.value
  }
  activeFilters.value = {...activeFilters.value, ...val }
}

const updateDetailResult = (id: string | number) => {
  // console.log(`TeeResults > updateDetailResult >  id : ${id}`)

  // Set detail infos
  programs.setDetailResult(id, props.trackId)
  nav.setCurrentDetailId(id, props.disableWidget)
  nav.updateUrl(props.disableWidget)
  scrollToTop(props.trackElement, props.disableWidget, props.trackId)
}

const getCostInfos = (program: ProgramData) => {
  let prefix: string = ''
  let text: string | undefined = ''
  // console.log('TeeResults > onBeforeMount > filteredPrograms :', filteredPrograms )

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
    case ProgramAidType.tax:
      prefix = 'programCosts.taxAdvantage'
      text = program["montant de l'avantage fiscal"]
      break
  }
  // Translate prefix
  prefix = choices.t(prefix)

  // No splitted amounts (non-breakable spaces in texts like '10 000 €')
  text = consolidateAmounts(text)

  return `${prefix} : ${text}`
}

onBeforeMount(() => {
  // console.log('TeeResults > onBeforeMount > filteredPrograms :', filteredPrograms )
  // analytics / send event
  analytics.sendEvent(props.trackId, 'show_results')
})

// const randomImage = () => {
//   const imagePath = randomChoice(defaultImages)
//   return imagePath
// }
</script>
