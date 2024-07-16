<template>
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-6v">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-container">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-mb-3v fr-text-center-md">
          <ResultHeader v-if="!navigationStore.isCatalog()" />
        </div>
      </div>
      <TeeTabs
        ref="tabs"
        class="fr-col-12"
        tab-list-name="Liste d’onglet"
        :tab-titles="tabTitles"
        :initial-selected-index="selected"
        @select-tab="onSelectedTabChange"
      >
        <template #tab-content-header>
          <ThemeFiltersAndCard
            id="tab-content-header"
            :has-spinner="hasSpinner"
          />
        </template>
        <DsfrTabContent
          class="fr-p-0"
          panel-id="tab-content-0"
          tab-id="tab-0"
          :selected="selected === 0"
          :asc="ascendant"
        >
          <ResultProjectList :filtered-projects="filteredProjects" />
        </DsfrTabContent>

        <DsfrTabContent
          class="fr-p-0"
          panel-id="tab-content-1"
          tab-id="tab-1"
          :selected="selected === 1"
          :asc="ascendant"
        >
          <ResultProgramList :filtered-programs="filteredPrograms" />
        </DsfrTabContent>
      </TeeTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { useProgramStore } from '@/stores/program'
import { ProgramData, PublicodeObjective, TrackId, Project } from '@/types'
import { computed, onBeforeMount } from 'vue'
import Matomo from '@/utils/matomo'
import { useProjectStore } from '@/stores/project'
import UsedTrack from '@/utils/track/usedTrack'
import { Theme } from '@/utils/theme'

const navigationStore = useNavigationStore()
const programStore = useProgramStore()
const projectStore = useProjectStore()
const { ascendant, selected } = useTabs(true, navigationStore.tabSelectedOnList)

const programs = ref<ProgramData[]>()
const projects = ref<Project[]>()
const hasError = ref<boolean>(false)

const tabTitles = [{ title: "Des idées d'actions à mettre en place" }, { title: 'Vos aides financières' }]

const hasSpinner = computed(() => {
  return (programs.value === undefined || projects.value === undefined) && !hasError.value
})

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const onSelectedTabChange = (tabSelected: number) => {
  selected.value = tabSelected
  navigationStore.tabSelectedOnList = tabSelected
}

const filteredProjects = computed(() => {
  if (!projects.value) {
    return undefined
  }

  return projectStore.getProjectsByPublicodeObjectiveAndEligibility(
    projects.value,
    getObjectiveForProjectFiltering(),
    filteredPrograms.value ?? undefined
  )
})

const getObjectiveForProjectFiltering = () => {
  return programStore.programFilters.objectiveTypeSelected !== ''
    ? (programStore.programFilters.objectiveTypeSelected as PublicodeObjective)
    : Theme.getPublicodeObjectiveByObjective(UsedTrack.getPriorityObjective())
}

onBeforeMount(async () => {
  const programResult = useUsedTrackStore().hasUsedTracks() ? await programStore.programsByUsedTracks : await programStore.programs
  const projectResult = await projectStore.projects
  if (programResult.isOk && projectResult.isOk) {
    programs.value = programResult.value
    projects.value = projectResult.value
  } else {
    hasError.value = true
  }

  // analytics / send event
  Matomo.sendEvent(TrackId.Results, navigationStore.isCatalog() ? 'show_results_catalog' : 'show_results')
})
</script>
