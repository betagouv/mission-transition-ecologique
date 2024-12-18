<template>
  <ClientOnly fallback-tag="div">
    <template #fallback>
      <div class="fr-container">
        <div class="fr-col-12 fr-col--middle fr-col-justify--center">
          <TeeSpinner />
        </div>
      </div>
    </template>
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
        <template #fallback>
          <TeeSpinner />
        </template>
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
  </ClientOnly>
</template>

<script setup lang="ts">
import { TeeDsfrTabsProps } from '@/components/element/vueDsfr/dsfrTabs/TeeDsfrTabs.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { ProjectManager } from '@/tools/project/projectManager'
import ProjectFilter from '@/tools/project/projectFilter'
import { BreakpointNameType, ProgramData } from '@/types'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/tools/theme'
import CompanyDataStorage from '@/tools/storage/companyDataStorage'

const navigationStore = useNavigationStore()
const programStore = useProgramStore()
const { projects } = storeToRefs(useProjectStore())
const programs = ref<ProgramData[]>()
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

  return ProjectFilter.getProjectsByTheme(projects.value, Theme.getThemeFromSelectedOrPriorityTheme().value)
})

onNuxtReady(async () => {
  await new ProjectManager().getFilteredProjects()
})

const getPrograms = async () => {
  navigationStore.hasSpinner = true
  const programResult = await programStore.programsByUsedTracks
  if (programResult.isOk()) {
    programs.value = programResult.data
  } else {
    hasError.value = true
  }
  navigationStore.hasSpinner = false
}

watchPostEffect(async () => {
  registeredData.value
  await getPrograms()
})
</script>
