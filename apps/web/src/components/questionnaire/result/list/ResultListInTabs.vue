<template>
  <TeeTabs
    ref="tabs"
    class="fr-col-12"
    tab-list-name="Liste d’onglet"
    :tab-titles="tabTitles"
    :initial-selected-index="selected"
    @select-tab="onSelectedTabChange"
  >
    <template #tab-content-header>
      <ThemeFiltersAndCard id="tab-content-header" />
    </template>
    <DsfrTabContent
      class="fr-p-0"
      panel-id="tab-content-0"
      tab-id="tab-0"
      :selected="selected === 0"
      :asc="ascendant"
    >
      <ResultProjectList
        :filtered-projects="filteredProjects"
        :has-error="hasError"
      />
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
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { ProgramData, Objective, TrackId, Project, BreakpointKeys } from '@/types'
import { computed, onBeforeMount } from 'vue'
import Matomo from '@/utils/matomo'
import { useProjectStore } from '@/stores/project'
import UsedTrack from '@/utils/track/usedTrack'
import { Theme } from '@/utils/theme'
import Breakpoint from '@/utils/breakpoints'

const navigationStore = useNavigationStore()
const programStore = useProgramStore()
const projectStore = useProjectStore()
const { ascendant, selected } = useTabs(true, navigationStore.tabSelectedOnList)

const programs = ref<ProgramData[]>()
const projects = ref<Project[]>()
const hasError = ref<boolean>(false)

interface TabTitle {
  title: string
  size: BreakpointKeys
}

const tabTitles = computed<TabTitle[]>(() => {
  const titles: TabTitle[] = [
    { title: "Des idées d'actions à mettre en place", size: 'sm' },
    { title: 'Vos aides financières', size: 'sm' },
    { title: "Idées d'actions", size: 'xs' },
    { title: 'Aides financières', size: 'xs' }
  ]
  if (Breakpoint.isMobile()) {
    return titles.filter((el) => el.size === 'xs')
  }
  return titles.filter((el) => el.size === 'sm')
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

  return projectStore.getProjectsByObjectiveAndEligibility(
    projects.value,
    getObjectiveForProjectFiltering(),
    filteredPrograms.value ?? undefined
  )
})

const getObjectiveForProjectFiltering = () => {
  return programStore.programFilters.objectiveTypeSelected !== ''
    ? (programStore.programFilters.objectiveTypeSelected as Objective)
    : Theme.getObjectiveByValue(UsedTrack.getPriorityObjective())
}

onBeforeMount(async () => {
  navigationStore.hasSpinner = true
  const programResult = await programStore.programsByUsedTracks
  const projectResult = await projectStore.projects
  if (programResult.isOk && projectResult.isOk) {
    programs.value = programResult.value
    projects.value = projectResult.value
  } else {
    hasError.value = true
  }
  navigationStore.hasSpinner = false

  // analytics / send event
  Matomo.sendEvent(TrackId.Results, 'show_results')
})
</script>
