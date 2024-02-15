<template>
  <!-- RESULTS ALERT FOR NO RESULTS BEFORE REFILTERING-->
  <TeeNoResults
    v-if="!countPrograms"
    image="images/tracks/no-results.svg"
    :message="{ fr: 'Aucune aide n\'a pu être identifiée avec les critères choisis...' }"
  >
  </TeeNoResults>

  <!-- RESULTS CALLBACK -->
  <h4
    v-if="countPrograms && false"
    class="fr-pt-12v"
  >
    {{ Translation.t('results.fittingPrograms') }}
    ({{ countPrograms }})
  </h4>

  <!-- PROGRAMS AS LIST OF CARDS -->
  <div
    v-if="countPrograms"
    class="fr-container fr-px-0 fr-mt-6v"
  >
    <!-- RESULTS SIZE -->
    <div
      v-if="countPrograms > 1"
      class="fr-mb-4v tee-text-light"
    >
      {{ countFilteredPrograms }}
      {{ Translation.t('results.results') }}
    </div>

    <!-- FILTERS IF ANY -->
    <ProgramFilters
      v-if="countPrograms > 1"
      @update-filter="updateFilters"
    />
    <!--      <div-->
    <!--        v-for="filter in []"-->
    <!--        class="fr-col"-->
    <!--      >-->
    <!--        <TeeResultsFilter-->
    <!--          :filter="filter"-->
    <!--          @update-filter="updateFilters"-->
    <!--        />-->
    <!--      </div>-->

    <!-- NO RESULTS -->
    <TeeNoResults
      v-if="!countFilteredPrograms"
      image="images/tracks/no-results.svg"
      :message="{ fr: 'Aucune aide n\'a pu être identifiée avec les critères choisis...' }"
    />

    <!-- PROGRAMS CARDS -->
    <component
      :is="navigation.isCatalog ? 'router-link' : 'div'"
      v-for="prog in filteredPrograms"
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
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeResults > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed, onBeforeMount, ref } from 'vue'
import Translation from '@/utils/translation'
import { useProgramsStore } from '@/stores/programs'
import { consolidateAmounts } from '@/utils/helpers'
import { type FilterSignal, type ProgramData, TrackId } from '@/types'
import { ProgramAidType } from '@/types/programTypes'
import { navigationStore } from '@/stores/navigation'
import { RouteName } from '@/types/routeType'
import Widget from '@/utils/widget'
import { useDebugStore } from '@/stores/debug'
import Config from '@/config'
import Matomo from '@/utils/matomo'
import TeeNoResults from '@/components/results/TeeNoResults.vue'
import ProgramFilters from '@/components/program/list/ProgramFilters.vue'

const programsStore = useProgramsStore()
const navigation = navigationStore()
const debugStore = useDebugStore()

const activeFilters = ref<Record<string, string>>({})

const publicPath = Config.publicPath

const programs: ProgramData[] | undefined = programsStore.filterPrograms()

const filteredPrograms = computed(() => {
  return programs?.filter(() => {
    return true
  })
})

const countPrograms = computed(() => {
  return programs?.length
})

const countFilteredPrograms = computed(() => {
  return filteredPrograms.value?.length
})

const updateFilters = (event: FilterSignal) => {
  const val = {
    [event.label]: event.value
  }
  activeFilters.value = { ...activeFilters.value, ...val }
}

const updateDetailResult = async (id: string | number) => {
  if (Widget.is) {
    programsStore.setDetailResult(id, TrackId.Results)
    return
  }
  if (navigation.isCatalog) {
    return
  }
  // Set detail infos
  programsStore.setDetailResult(id, TrackId.Results)
  await navigation.setCurrentDetailId(id)
  // scrollToTop(props.trackElement)
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
  Matomo.sendEvent(TrackId.Results, navigation.isCatalog ? 'show_results_catalog' : 'show_results')
})
</script>
