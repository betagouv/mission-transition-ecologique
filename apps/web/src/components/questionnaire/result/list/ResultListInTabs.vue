<template>
  <TeeDsfrTabs
    ref="tabs"
    v-model="tabSelectedOnList"
    class="fr-col-12"
    tab-list-name="Liste d’onglet"
    :tab-titles="titles"
  >
    <template #tab-content-header>
      <ThemeFiltersAndCard id="tab-content-header" />
    </template>
    <DsfrTabContent
      class="fr-p-0"
      :panel-id="titles[0].panelId"
      :tab-id="titles[0].tabId"
    >
      <ResultProjectList
        :filtered-projects="filteredProjects"
        :has-error="hasError"
      />
    </DsfrTabContent>

    <DsfrTabContent
      class="fr-p-0"
      :panel-id="titles[1].panelId"
      :tab-id="titles[1].tabId"
    >
      <ResultProgramList
        :filtered-programs="filteredPrograms"
        :has-error="hasError"
      />
    </DsfrTabContent>
  </TeeDsfrTabs>
</template>

<script setup lang="ts">
import { TeeDsfrTabsProps } from '@/components/element/vueDsfr/dsfrTabs/TeeDsfrTabs.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { BreakpointNameType, ProgramData, Project } from '@/types'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/utils/theme'
import { CompanyDataStorage } from '@/utils/companyData'

const navigationStore = useNavigationStore()
const programStore = useProgramStore()
const projectStore = useProjectStore()
const programs = ref<ProgramData[]>()
const projects = ref<Project[]>()
const hasError = ref<boolean>(false)
const { tabSelectedOnList } = storeToRefs(navigationStore)

const registeredData = CompanyDataStorage.getData()

const titles: TeeDsfrTabsProps['tabTitles'] = [
  {
    title: [{ title: "Des idées d'actions à mettre en place", size: BreakpointNameType.sm }, { title: "Idées d'actions" }],
    tabId: 'tab-0',
    panelId: 'tab-content-0'
  },
  {
    title: [{ title: 'Vos aides financières', size: BreakpointNameType.sm }, { title: 'Aides financières' }],
    tabId: 'tab-1',
    panelId: 'tab-content-1'
  }
]

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const filteredProjects = computed(() => {
  if (!projects.value) {
    return undefined
  }

  return projectStore.getProjectsByTheme(projects.value, Theme.getThemeFromSelectedOrPriorityTheme().value)
})

const getProgramsAndProjects = async () => {
  navigationStore.hasSpinner = true
  const programResult = await programStore.programsByUsedTracks
  const projectResult = await projectStore.eligibleProjects
  if (programResult.isOk && projectResult.isOk) {
    programs.value = programResult.value
    projects.value = projectResult.value
  } else {
    hasError.value = true
  }
  navigationStore.hasSpinner = false
}
watch(
  registeredData.value,
  async () => {
    await getProgramsAndProjects()
  },
  {
    immediate: true
  }
)
</script>
