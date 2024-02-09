<template>
  <!-- DEBUGGING -->
  <div
    v-if="debugStore.is"
    class="vue-debug"
  >
    <h5>DEBUG - TeeResults</h5>
    <!-- <h6>
      programs.programDetail : <code>{{ programs.programDetail || 'undefined' }}</code>
    </h6> -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v">
          trackId : <code>{{ trackId }} </code>
        </h6>
      </div>
      <!-- <div class="fr-col-4">
        <h6 class="fr-mb-1v"> trackConfig : </h6>
          <pre><code>{{ trackConfig }} </code></pre>
      </div> -->
      <div class="fr-col-9">
        <h6 class="fr-mb-1v">activeFilters :</h6>
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
    class="fr-pt-12v"
  >
    {{ Translation.t('results.fittingPrograms') }}
    ({{ countFilteredPrograms }})
  </h4>

  <!-- PROGRAMS AS LIST OF CARDS -->
  <div
    v-if="countFilteredPrograms"
    class="fr-container fr-px-2v fr-mt-6v"
  >
    <!-- RESULTS SIZE -->
    <div
      v-if="countFilteredPrograms > 1"
      class="fr-mb-4v tee-text-light"
    >
      {{ countReFilteredPrograms }}
      {{ Translation.t('results.results') }}
    </div>

    <!-- FILTERS IF ANY -->
    <div
      v-if="trackConfig?.filters && countFilteredPrograms > 1"
      class="fr-grid-row fr-grid-row--gutters fr-mb-4v"
    >
      <div
        v-for="filter in trackConfig.filters"
        :key="filter.label"
        class="fr-col"
      >
        <TeeResultsFilter
          :filter="filter"
          @update-filter="updateFilters"
        />
      </div>
    </div>

    <!-- NO RESULTS -->
    <TeeNoResults
      v-if="!countReFilteredPrograms"
      :image="trackConfig?.noResultsImage"
      :message="trackConfig?.noResultsMessage"
    />

    <!-- PROGRAMS CARDS -->
    <component
      :is="navigation.isCatalog ? 'router-link' : 'div'"
      v-for="prog in reFilteredPrograms"
      :id="prog.id"
      :key="prog.id"
      :to="navigation.isCatalog ? { name: RouteName.CatalogDetail, params: { programId: prog.id.toString() } } : undefined"
      class="fr-card fr-enlarge-link fr-card--horizontal-tier fr-mb-10v"
      @click="updateDetailResult(prog.id)"
    >
      <div class="fr-card__body">
        <div class="fr-card__content">
          <!-- TITLE -->
          <div class="fr-card__start fr-mb-2v">
            <p class="tee-program-title">
              {{ prog.titre }}
            </p>
          </div>
          <!-- CONTENT -->
          <h2 class="fr-card__title tee-program-resume fr-mb-3v">
            {{ prog.promesse }}
          </h2>
          <!-- DEBUG -->
          <p
            v-if="debugStore.is"
            class="vue-debug fr-card__desc"
          >
            <br />
            publicPath : <code>{{ publicPath }}</code> <br />
            prog.cover : <code>{{ prog.illustration }}</code>
            <!-- {{ `${publicPath}${randomImage()}` }} -->
          </p>
          <!-- END -->
          <div class="fr-card__end">
            <p class="fr-mb-0 tee-program-info">
              <span
                class="fr-icon-money-euro-circle-line"
                aria-hidden="true"
              >
              </span>
              {{ getCostInfos(prog) }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="prog.illustration"
        class="fr-card__header"
      >
        <div class="fr-card__img">
          <img
            class="fr-responsive-img"
            :src="`${publicPath}${prog.illustration}`"
            :alt="`image / ${prog.titre}`"
          />
        </div>
        <ul class="fr-badges-group">
          <p class="fr-badge tee-program-badge-image">
            {{ prog["nature de l'aide"] }}
          </p>
        </ul>
      </div>
    </component>
  </div>

  <!-- DEBUGGING -->
  <div
    v-if="debugStore.is"
    class="vue-debug"
  >
    <h5>DEBUG - TeeResults</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-6">
        <h6>filteredPrograms</h6>
        <code>
          <pre>{{ filteredPrograms }}</pre>
        </code>
      </div>
      <div class="fr-col-6">
        <h6>tracksResults</h6>
        <code>
          <pre>{{ tracksResults }}</pre>
        </code>
        <h6>programs.progs</h6>
        <code>
          <pre>{{ programs.progs }}</pre>
        </code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeResults > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed, onBeforeMount, ref } from 'vue'
import Translation from '@/utils/translation'
import { programsStore } from '@/stores/programs'
import { consolidateAmounts, getFrom, scrollToTop } from '@/utils/helpers'
import TeeResultsFilter from './TeeResultsFilter.vue'
import TeeNoResults from './TeeNoResults.vue'
import type { FilterSignal, ProgramData, PropertyPath, TrackFilter, TrackResultsConfig, UsedTrack } from '@/types'
import { ConditionOperators, TrackId } from '@/types'
import { ProgramAidType } from '@/types/programTypes'
import { navigationStore } from '@/stores/navigation'
import { RouteName } from '@/types/routeType'
import Widget from '@/utils/widget'
import { useDebugStore } from '@/stores/debug'
import MetaEnv from '@/utils/metaEnv'
import Matomo from '@/utils/matomo'

const programs = programsStore()
const navigation = navigationStore()
const debugStore = useDebugStore()

const activeFilters = ref<Record<string, string>>({})

interface Props {
  trackId: TrackId
  trackConfig?: TrackResultsConfig
  trackOptions?: any
  trackForm?: any
  tracksResults: UsedTrack[]
  trackElement: Element
}
const props = defineProps<Props>()

const publicPath = MetaEnv.publicPath

const filteredPrograms: ProgramData[] | undefined = programs.filterPrograms(props.tracksResults)

const reFilteredPrograms = computed(() => {
  return filteredPrograms?.filter((prog: ProgramData) => {
    const boolArray = [true]
    for (const filterLabel in activeFilters.value) {
      const filterVal = activeFilters.value[filterLabel]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const filterConfig: TrackFilter | undefined = props.trackConfig?.filters?.find((filter: any) => filter.label === filterLabel)
      const filterField: PropertyPath = filterConfig?.field || ''
      const trueIf = filterConfig?.trueIf || ConditionOperators.is

      let progVal = getFrom(prog, [filterField])
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      progVal = JSON.parse(JSON.stringify(progVal))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      progVal = progVal[0]

      let bool = false
      if (filterVal === '') {
        bool = true
      } else if (trueIf === ConditionOperators.is) {
        bool = (progVal as unknown as string) === filterVal
      } else if (trueIf === ConditionOperators.exists) {
        progVal = progVal?.filter((i) => i !== null)
        bool = !progVal ? true : progVal.includes(filterVal)
      } else {
        bool = true
      }
      boolArray.push(bool)
    }
    return boolArray.every((b) => !!b)
  })
})

const countFilteredPrograms = computed(() => {
  return filteredPrograms?.length
})

const countReFilteredPrograms = computed(() => {
  return reFilteredPrograms.value?.length
})

const updateFilters = (event: FilterSignal) => {
  const val = {
    [event.label]: event.value
  }
  activeFilters.value = { ...activeFilters.value, ...val }
}

const updateDetailResult = async (id: string | number) => {
  if (Widget.is) {
    programs.setDetailResult(id, props.trackId)
    return
  }
  if (navigation.isCatalog) {
    return
  }
  // Set detail infos
  programs.setDetailResult(id, props.trackId)
  await navigation.setCurrentDetailId(id)
  scrollToTop(props.trackElement)
}

const getCostInfos = (program: ProgramData) => {
  let prefix: string = ''
  let text: string | undefined = ''

  switch (program["nature de l'aide"]) {
    case ProgramAidType.acc:
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
  prefix = Translation.t(prefix)

  text = consolidateAmounts(text)

  return `${prefix} : ${text}`
}

onBeforeMount(() => {
  // analytics / send event
  Matomo.sendEvent(props.trackId, navigation.isCatalog ? 'show_results_catalog' : 'show_results')
})
</script>
