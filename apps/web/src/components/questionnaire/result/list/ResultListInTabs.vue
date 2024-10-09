<template>
  <TeeTabs
    ref="tabs"
    class="fr-col-12"
    tab-list-name="Liste d’onglet"
    :tab-titles="titles"
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
import { TeeDsfrTabs } from '@/components/element/TeeTabs.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { BreakpointNameType, ProgramType, Project, TrackId } from '@/types'
import { computed, onBeforeMount } from 'vue'
import Analytics from '@/utils/analytic/analytics'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/utils/theme'

const navigationStore = useNavigationStore()
const programStore = useProgramStore()
const projectStore = useProjectStore()
const { ascendant, selected } = useTabs(true, navigationStore.tabSelectedOnList)

const programs = ref<ProgramType[]>()
const projects = ref<Project[]>()
const hasError = ref<boolean>(false)

const titles: TeeDsfrTabs['tabTitles'] = [
  { title: [{ title: "Des idées d'actions à mettre en place", size: BreakpointNameType.sm }, { title: "Idées d'actions" }] },
  { title: [{ title: 'Vos aides financières', size: BreakpointNameType.sm }, { title: 'Aides financières' }] }
]

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

  return projectStore.getProjectsByThemeAndEligibility(
    projects.value,
    Theme.getThemeFromSelectedOrPriorityTheme().value,
    filteredPrograms.value ?? undefined
  )
})

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
  Analytics.sendEvent(TrackId.Results, 'show_results')
})
</script>
