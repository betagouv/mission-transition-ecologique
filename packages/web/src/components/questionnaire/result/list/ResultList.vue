<template>
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0 fr-mb-0 fr-mt-6v fr-mr-lg-6v">
    <div class="fr-grid-row fr-grid-row--center fr-justify-center">
      <div class="fr-col-9 fr-col-offset-md-2 fr-col-xs-12 fr-px-0 fr-px-md-4v">
        <ResultHeader v-if="!navigationStore.isCatalog()" />
      </div>
      <ProgramFilters
        v-if="(!hasSpinner || !hasError) && selectedTabIndex === 1"
        :has-error="hasError"
        :has-spinner="hasSpinner"
      />
      <div
        v-if="selectedTabIndex === 0"
        class="fr-col-2"
      >
        <div
          v-if="!hasSpinner || !hasError"
          class="fr-col-hidden fr-col-unhidden-lg"
        >
          <img
            :src="`${publicPath}images/TEE_project_priority.svg`"
            alt=""
            class="fr-responsive-img"
            :style="imgInlineStyle"
          />
        </div>
      </div>
      <DsfrTabs
        ref="tabs"
        class="fr-col-9 fr-col-xs-12 fr-px-0"
        :class="!hasSpinner || !hasError"
        :tab-list-name="tabListName"
        :tab-titles="tabTitles"
        :initial-selected-index="initialSelectedIndex"
        @select-tab="selectTab"
      >
        <DsfrTabContent
          class="fr-px-0 fr-px-md-4v"
          panel-id="tab-content-0"
          tab-id="tab-0"
          :selected="selectedTabIndex === 0"
          :asc="asc"
        >
          <ProjectList
            :filtered-programs="filteredPrograms"
            @window-resize="defineProjectPriorityImagePosition"
          />
        </DsfrTabContent>

        <DsfrTabContent
          class="fr-px-0 fr-px-md-4v"
          panel-id="tab-content-1"
          tab-id="tab-1"
          :selected="selectedTabIndex === 1"
          :asc="asc"
        >
          <ProgramList :filtered-programs="filteredPrograms" />
        </DsfrTabContent>
      </DsfrTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { useProgramStore } from '@/stores/program'
import { ProgramData, TrackId } from '@/types'
import { computed, onBeforeMount } from 'vue'
import Matomo from '@/utils/matomo'
import Config from '@/config'

const navigationStore = useNavigationStore()
const programStore = useProgramStore()

const publicPath = Config.publicPath

const programs = ref<ProgramData[]>()
const hasError = ref<boolean>(false)
const imgPosition = ref<string>('')

const hasSpinner = computed(() => {
  return programs.value === undefined && !hasError.value
})

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const initialSelectedIndex = 0
const tabListName = 'Liste d’onglet'
const tabTitles = [{ title: "Des idées d'actions à mettre en place" }, { title: 'Vos aides financières' }]
const asc = ref(true)
const selectedTabIndex = ref(initialSelectedIndex)

const selectTab = (idx: number) => {
  asc.value = selectedTabIndex.value < idx
  selectedTabIndex.value = idx
}
const defineProjectPriorityImagePosition = (position: string) => {
  console.log('position', position)
  imgPosition.value = position
}
const imgInlineStyle = computed(() => {
  console.log('imgPosition', imgPosition.value)
  return `position: relative; left: 0; top: ${imgPosition.value}px; max-height: 18rem`
})

onBeforeMount(async () => {
  const result = useUsedTrackStore().hasUsedTracks() ? await programStore.programsByUsedTracks : await programStore.programs
  if (result.isOk) {
    programs.value = result.value
  } else {
    hasError.value = true
  }

  // analytics / send event
  Matomo.sendEvent(TrackId.Results, navigationStore.isCatalog() ? 'show_results_catalog' : 'show_results')
})
</script>
